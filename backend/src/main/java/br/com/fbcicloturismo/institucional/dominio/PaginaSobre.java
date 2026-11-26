package br.com.fbcicloturismo.institucional.dominio;

import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * A página "Sobre nós": a história, a linha do tempo e as fotos. Existe uma só, sempre com o id {@link #ID}: o ADM a
 * cria no primeiro salvamento e depois só a altera.
 */
@Entity
public class PaginaSobre {

	public static final long ID = 1;

	public static final int MAXIMO_DE_FOTOS = 8;

	public static final int MAXIMO_DE_MARCOS = 8;

	@Id
	private Long id;

	private String titulo;

	private String chamada;

	@Column(columnDefinition = "text")
	private String historia;

	private String citacao;

	@ElementCollection
	@CollectionTable(name = "pagina_sobre_marco", joinColumns = @JoinColumn(name = "pagina_id"))
	@OrderColumn(name = "ordem")
	private List<Marco> marcos = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "pagina_sobre_foto", joinColumns = @JoinColumn(name = "pagina_id"))
	@OrderColumn(name = "ordem")
	private List<FotoSobre> fotos = new ArrayList<>();

	@UpdateTimestamp
	private Instant atualizadoEm;

	protected PaginaSobre() {
	}

	public PaginaSobre(DadosPaginaSobre dados) {
		this.id = ID;
		atualizar(dados);
	}

	public void atualizar(DadosPaginaSobre dados) {
		if (dados.fotos().size() > MAXIMO_DE_FOTOS) {
			throw new RegraDeNegocioException("A página pode ter até %d fotos.".formatted(MAXIMO_DE_FOTOS));
		}
		if (dados.marcos().size() > MAXIMO_DE_MARCOS) {
			throw new RegraDeNegocioException("A linha do tempo pode ter até %d marcos.".formatted(MAXIMO_DE_MARCOS));
		}
		this.titulo = dados.titulo();
		this.chamada = dados.chamada();
		this.historia = dados.historia();
		this.citacao = dados.citacao();
		this.marcos.clear();
		this.marcos.addAll(dados.marcos());
		this.fotos.clear();
		this.fotos.addAll(dados.fotos());
	}

	public String getTitulo() {
		return titulo;
	}

	public String getChamada() {
		return chamada;
	}

	public String getHistoria() {
		return historia;
	}

	public String getCitacao() {
		return citacao;
	}

	public List<Marco> getMarcos() {
		return List.copyOf(marcos);
	}

	public List<FotoSobre> getFotos() {
		return List.copyOf(fotos);
	}

	public Instant getAtualizadoEm() {
		return atualizadoEm;
	}

}
