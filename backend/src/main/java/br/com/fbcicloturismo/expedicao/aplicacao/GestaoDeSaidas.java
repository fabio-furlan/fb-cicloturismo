package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.compartilhado.dominio.RecursoNaoEncontradoException;
import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import br.com.fbcicloturismo.expedicao.dominio.PeriodoSaida;
import br.com.fbcicloturismo.expedicao.dominio.Saida;
import br.com.fbcicloturismo.expedicao.dominio.SituacaoSaida;
import br.com.fbcicloturismo.expedicao.infraestrutura.RoteiroRepository;
import br.com.fbcicloturismo.expedicao.infraestrutura.SaidaRepository;
import java.time.Clock;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Cadastro das saídas (edições vendáveis) de um roteiro e dos seus opcionais, pelo ADM. */
@Service
@Transactional
public class GestaoDeSaidas {

	private final SaidaRepository saidas;

	private final RoteiroRepository roteiros;

	private final Clock clock;

	GestaoDeSaidas(SaidaRepository saidas, RoteiroRepository roteiros, Clock clock) {
		this.saidas = saidas;
		this.roteiros = roteiros;
		this.clock = clock;
	}

	/** Cria a saída como rascunho; ela só aparece para venda depois de {@link #publicar(long) publicada}. */
	public SaidaVisao criar(long roteiroId, DadosSaida dados) {
		var roteiro = roteiros.findById(roteiroId)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Roteiro %d não encontrado.".formatted(roteiroId)));
		var saida = saidas.save(new Saida(roteiro, dados.periodo(), dados.capacidade(), dados.precoBase()));
		return visao(saida);
	}

	public SaidaVisao alterar(long id, DadosSaida dados) {
		var saida = carregar(id);
		saida.alterar(dados.periodo(), dados.capacidade(), dados.precoBase());
		return visao(saida);
	}

	@Transactional(readOnly = true)
	public SaidaVisao buscar(long id) {
		return visao(carregar(id));
	}

	public SaidaVisao publicar(long id) {
		var saida = carregar(id);
		saida.publicar();
		return visao(saida);
	}

	public SaidaVisao cancelar(long id) {
		var saida = carregar(id);
		saida.cancelar();
		return visao(saida);
	}

	/** Copia a saída, com capacidade, preço e opcionais, para novas datas. A cópia nasce como rascunho. */
	public SaidaVisao duplicar(long id, PeriodoSaida periodo) {
		var copia = saidas.save(carregar(id).duplicarPara(periodo));
		return visao(copia);
	}

	public SaidaVisao adicionarOpcional(long saidaId, NovoOpcional opcional) {
		var saida = carregar(saidaId);
		saida.adicionarOpcional(opcional.grupo(), opcional.nome(), opcional.descricao(), opcional.acrescimo());
		// Grava já, para o opcional novo voltar com o id gerado pelo banco.
		saidas.flush();
		return visao(saida);
	}

	public SaidaVisao removerOpcional(long saidaId, long opcionalId) {
		var saida = carregar(saidaId);
		saida.removerOpcional(opcionalId);
		return visao(saida);
	}

	/** Só exclui rascunhos: uma saída que já foi publicada pode ter inscrições, então deve ser cancelada. */
	public void excluir(long id) {
		var saida = carregar(id);
		if (saida.getSituacao() != SituacaoSaida.RASCUNHO) {
			throw new RegraDeNegocioException("Só saídas em rascunho podem ser excluídas. Cancele a saída.");
		}
		saidas.delete(saida);
	}

	private Saida carregar(long id) {
		return saidas.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Saída %d não encontrada.".formatted(id)));
	}

	private SaidaVisao visao(Saida saida) {
		return SaidaVisao.de(saida, LocalDate.now(clock));
	}

}
