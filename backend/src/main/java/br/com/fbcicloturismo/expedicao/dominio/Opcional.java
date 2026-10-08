package br.com.fbcicloturismo.expedicao.dominio;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;

/** Acréscimo contratável em uma saída: quarto individual, aluguel de bike, transfer. */
@Entity
public class Opcional {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "saida_id")
	private Saida saida;

	@Enumerated(EnumType.STRING)
	private GrupoOpcional grupo;

	private String nome;

	private String descricao;

	private BigDecimal acrescimo;

	private int ordem;

	protected Opcional() {
	}

	Opcional(Saida saida, GrupoOpcional grupo, String nome, String descricao, BigDecimal acrescimo, int ordem) {
		this.saida = saida;
		this.grupo = grupo;
		this.nome = nome;
		this.descricao = descricao;
		this.acrescimo = acrescimo;
		this.ordem = ordem;
	}

	Opcional copiarPara(Saida outraSaida) {
		return new Opcional(outraSaida, grupo, nome, descricao, acrescimo, ordem);
	}

	public Long getId() {
		return id;
	}

	public Saida getSaida() {
		return saida;
	}

	public GrupoOpcional getGrupo() {
		return grupo;
	}

	public String getNome() {
		return nome;
	}

	public String getDescricao() {
		return descricao;
	}

	public BigDecimal getAcrescimo() {
		return acrescimo;
	}

	public int getOrdem() {
		return ordem;
	}

}
