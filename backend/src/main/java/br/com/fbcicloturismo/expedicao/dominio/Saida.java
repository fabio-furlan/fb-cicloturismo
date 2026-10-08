package br.com.fbcicloturismo.expedicao.dominio;

import br.com.fbcicloturismo.compartilhado.dominio.RecursoNaoEncontradoException;
import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Version;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Uma edição vendável de um {@link Roteiro}: datas, vagas, preço e opcionais. Só a {@link SituacaoSaida} é gravada; o
 * {@link StatusSaida} exibido no dashboard é calculado.
 */
@Entity
public class Saida {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "roteiro_id")
	private Roteiro roteiro;

	private LocalDate dataInicio;

	private LocalDate dataFim;

	private LocalDate inscricoesAte;

	private int capacidade;

	private int vagasOcupadas;

	private BigDecimal precoBase;

	@Enumerated(EnumType.STRING)
	private SituacaoSaida situacao = SituacaoSaida.RASCUNHO;

	@OneToMany(mappedBy = "saida", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("grupo, ordem")
	private List<Opcional> opcionais = new ArrayList<>();

	/** Controle de concorrência otimista: duas reservas simultâneas não ultrapassam a capacidade. */
	@Version
	private long versao;

	@CreationTimestamp
	private Instant criadoEm;

	@UpdateTimestamp
	private Instant atualizadoEm;

	protected Saida() {
	}

	public Saida(Roteiro roteiro, PeriodoSaida periodo, int capacidade, BigDecimal precoBase) {
		this.roteiro = roteiro;
		alterar(periodo, capacidade, precoBase);
	}

	public void alterar(PeriodoSaida periodo, int capacidade, BigDecimal precoBase) {
		if (capacidade <= 0) {
			throw new RegraDeNegocioException("A capacidade precisa ser maior que zero.");
		}
		if (capacidade < vagasOcupadas) {
			throw new RegraDeNegocioException(
					"A capacidade não pode ficar abaixo das %d vagas já ocupadas.".formatted(vagasOcupadas));
		}
		if (precoBase.signum() < 0) {
			throw new RegraDeNegocioException("O preço base não pode ser negativo.");
		}
		this.dataInicio = periodo.dataInicio();
		this.dataFim = periodo.dataFim();
		this.inscricoesAte = periodo.inscricoesAte();
		this.capacidade = capacidade;
		this.precoBase = precoBase;
	}

	public StatusSaida status(LocalDate hoje) {
		return switch (situacao) {
			case RASCUNHO -> StatusSaida.RASCUNHO;
			case CANCELADA -> StatusSaida.CANCELADA;
			case PUBLICADA -> {
				if (hoje.isAfter(dataFim)) {
					yield StatusSaida.FINALIZADA;
				}
				if (!hoje.isBefore(dataInicio)) {
					yield StatusSaida.EM_ANDAMENTO;
				}
				if (vagasDisponiveis() == 0) {
					yield StatusSaida.ESGOTADA;
				}
				if (hoje.isAfter(inscricoesAte)) {
					yield StatusSaida.INSCRICOES_ENCERRADAS;
				}
				yield StatusSaida.ABERTA;
			}
		};
	}

	public int vagasDisponiveis() {
		return capacidade - vagasOcupadas;
	}

	public void publicar() {
		if (situacao == SituacaoSaida.CANCELADA) {
			throw new RegraDeNegocioException("Uma saída cancelada não pode ser publicada. Duplique-a para novas datas.");
		}
		situacao = SituacaoSaida.PUBLICADA;
	}

	public void cancelar() {
		situacao = SituacaoSaida.CANCELADA;
	}

	/** Ocupa vagas para uma inscrição. Só é possível com a saída aberta e vagas suficientes. */
	public void reservarVagas(int quantidade, LocalDate hoje) {
		if (quantidade <= 0) {
			throw new RegraDeNegocioException("A quantidade de vagas precisa ser maior que zero.");
		}
		if (status(hoje) != StatusSaida.ABERTA) {
			throw new RegraDeNegocioException("As inscrições desta saída não estão abertas.");
		}
		if (quantidade > vagasDisponiveis()) {
			throw new RegraDeNegocioException("Restam só %d vagas nesta saída.".formatted(vagasDisponiveis()));
		}
		vagasOcupadas += quantidade;
	}

	/** Devolve vagas de uma inscrição cancelada. */
	public void liberarVagas(int quantidade) {
		if (quantidade <= 0 || quantidade > vagasOcupadas) {
			throw new RegraDeNegocioException("Não há %d vagas ocupadas para liberar.".formatted(quantidade));
		}
		vagasOcupadas -= quantidade;
	}

	public Opcional adicionarOpcional(GrupoOpcional grupo, String nome, String descricao, BigDecimal acrescimo) {
		if (acrescimo.signum() < 0) {
			throw new RegraDeNegocioException("O acréscimo de um opcional não pode ser negativo.");
		}
		boolean nomeRepetido = opcionais.stream()
				.anyMatch(opcional -> opcional.getGrupo() == grupo && opcional.getNome().equalsIgnoreCase(nome));
		if (nomeRepetido) {
			throw new RegraDeNegocioException("Já existe o opcional \"%s\" nesse grupo.".formatted(nome));
		}
		int ordem = (int) opcionais.stream().filter(opcional -> opcional.getGrupo() == grupo).count();
		var opcional = new Opcional(this, grupo, nome, descricao, acrescimo, ordem);
		opcionais.add(opcional);
		return opcional;
	}

	public void removerOpcional(long opcionalId) {
		boolean removido = opcionais.removeIf(opcional -> opcional.getId() != null && opcional.getId() == opcionalId);
		if (!removido) {
			throw new RecursoNaoEncontradoException("Opcional %d não encontrado nesta saída.".formatted(opcionalId));
		}
	}

	/** Nova saída do mesmo roteiro em outras datas, com a mesma capacidade, preço e opcionais. Nasce como rascunho. */
	public Saida duplicarPara(PeriodoSaida periodo) {
		var copia = new Saida(roteiro, periodo, capacidade, precoBase);
		opcionais.forEach(opcional -> copia.opcionais.add(opcional.copiarPara(copia)));
		return copia;
	}

	public Long getId() {
		return id;
	}

	public Roteiro getRoteiro() {
		return roteiro;
	}

	public LocalDate getDataInicio() {
		return dataInicio;
	}

	public LocalDate getDataFim() {
		return dataFim;
	}

	public LocalDate getInscricoesAte() {
		return inscricoesAte;
	}

	public int getCapacidade() {
		return capacidade;
	}

	public int getVagasOcupadas() {
		return vagasOcupadas;
	}

	public BigDecimal getPrecoBase() {
		return precoBase;
	}

	public SituacaoSaida getSituacao() {
		return situacao;
	}

	public List<Opcional> getOpcionais() {
		return List.copyOf(opcionais);
	}

	public long getVersao() {
		return versao;
	}

	public Instant getCriadoEm() {
		return criadoEm;
	}

	public Instant getAtualizadoEm() {
		return atualizadoEm;
	}

}
