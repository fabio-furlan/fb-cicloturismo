package br.com.fbcicloturismo.expedicao.dominio;

import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

/** O produto: o percurso, sua descrição e suas imagens. As datas, vagas e preços ficam em cada {@link Saida}. */
@Entity
public class Roteiro {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** Identificador legível, usado nas URLs do site. */
	private String slug;

	private String titulo;

	private String regiao;

	@Column(columnDefinition = "text")
	private String descricao;

	@Enumerated(EnumType.STRING)
	private Modalidade modalidade;

	@Enumerated(EnumType.STRING)
	private Destino destino;

	@Enumerated(EnumType.STRING)
	private Nivel nivel;

	@Enumerated(EnumType.STRING)
	private Paisagem paisagem;

	/** Duração total da viagem, incluindo dias sem pedal. */
	private int dias;

	private BigDecimal distanciaKm;

	@Column(name = "subida_total_m")
	private int subidaTotalM;

	/** Perfil altimétrico: altitudes em metros, amostradas em intervalos iguais do início ao fim do percurso. */
	@JdbcTypeCode(SqlTypes.ARRAY)
	private int[] altitudes = new int[0];

	@ElementCollection
	@CollectionTable(name = "roteiro_etapa", joinColumns = @JoinColumn(name = "roteiro_id"))
	@OrderBy("dia")
	private List<Etapa> etapas = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "roteiro_imagem", joinColumns = @JoinColumn(name = "roteiro_id"))
	@OrderColumn(name = "ordem")
	private List<Imagem> imagens = new ArrayList<>();

	@CreationTimestamp
	private Instant criadoEm;

	@UpdateTimestamp
	private Instant atualizadoEm;

	protected Roteiro() {
	}

	public Roteiro(String slug, DadosRoteiro dados) {
		this.slug = slug;
		atualizar(dados);
	}

	public void atualizar(DadosRoteiro dados) {
		validar(dados);
		this.titulo = dados.titulo();
		this.regiao = dados.regiao();
		this.descricao = dados.descricao();
		this.modalidade = dados.modalidade();
		this.destino = dados.destino();
		this.nivel = dados.nivel();
		this.paisagem = dados.paisagem();
		this.dias = dados.dias();
		this.subidaTotalM = dados.subidaTotalM();
		this.altitudes = dados.altitudes().clone();
		this.etapas.clear();
		this.etapas.addAll(dados.etapas());
		this.distanciaKm = dados.etapas().stream()
				.map(Etapa::distanciaKm)
				.reduce(BigDecimal.ZERO, BigDecimal::add)
				.setScale(1, RoundingMode.HALF_UP);
		this.imagens.clear();
		this.imagens.addAll(dados.imagens());
	}

	private static void validar(DadosRoteiro dados) {
		var diasComEtapa = new HashSet<Integer>();
		for (Etapa etapa : dados.etapas()) {
			if (etapa.dia() > dados.dias()) {
				throw new RegraDeNegocioException(
						"A etapa do dia %d passa da duração do roteiro (%d dias).".formatted(etapa.dia(), dados.dias()));
			}
			if (!diasComEtapa.add(etapa.dia())) {
				throw new RegraDeNegocioException("Há mais de uma etapa no dia %d.".formatted(etapa.dia()));
			}
		}
		long banners = dados.imagens().stream().filter(imagem -> imagem.tipo() == TipoImagem.BANNER).count();
		if (banners > 1) {
			throw new RegraDeNegocioException("O roteiro pode ter só uma imagem de banner.");
		}
	}

	public Long getId() {
		return id;
	}

	public String getSlug() {
		return slug;
	}

	public String getTitulo() {
		return titulo;
	}

	public String getRegiao() {
		return regiao;
	}

	public String getDescricao() {
		return descricao;
	}

	public Modalidade getModalidade() {
		return modalidade;
	}

	public Destino getDestino() {
		return destino;
	}

	public Nivel getNivel() {
		return nivel;
	}

	public Paisagem getPaisagem() {
		return paisagem;
	}

	public int getDias() {
		return dias;
	}

	/** Soma das distâncias das etapas. */
	public BigDecimal getDistanciaKm() {
		return distanciaKm;
	}

	public int getSubidaTotalM() {
		return subidaTotalM;
	}

	public int[] getAltitudes() {
		return altitudes.clone();
	}

	public List<Etapa> getEtapas() {
		return List.copyOf(etapas);
	}

	public List<Imagem> getImagens() {
		return List.copyOf(imagens);
	}

	public Instant getCriadoEm() {
		return criadoEm;
	}

	public Instant getAtualizadoEm() {
		return atualizadoEm;
	}

}
