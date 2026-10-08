package br.com.fbcicloturismo.expedicao.api;

import br.com.fbcicloturismo.expedicao.dominio.DadosRoteiro;
import br.com.fbcicloturismo.expedicao.dominio.Destino;
import br.com.fbcicloturismo.expedicao.dominio.Etapa;
import br.com.fbcicloturismo.expedicao.dominio.Imagem;
import br.com.fbcicloturismo.expedicao.dominio.Modalidade;
import br.com.fbcicloturismo.expedicao.dominio.Nivel;
import br.com.fbcicloturismo.expedicao.dominio.Paisagem;
import br.com.fbcicloturismo.expedicao.dominio.TipoImagem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

/** Corpo da criação e da edição de um roteiro. Os limites seguem as colunas da migration V1. */
record RoteiroRequest(
		@NotBlank @Size(max = 120) String titulo,
		@NotBlank @Size(max = 160) String regiao,
		@NotBlank String descricao,
		@NotNull Modalidade modalidade,
		@NotNull Destino destino,
		@NotNull Nivel nivel,
		@NotNull Paisagem paisagem,
		@NotNull @Positive Integer dias,
		@NotNull @PositiveOrZero Integer subidaTotalM,
		@NotNull int[] altitudes,
		@NotNull List<@Valid @NotNull EtapaRequest> etapas,
		@NotNull List<@Valid @NotNull ImagemRequest> imagens) {

	record EtapaRequest(
			@NotNull @Positive Integer dia,
			@NotBlank @Size(max = 160) String titulo,
			@NotNull @PositiveOrZero @Digits(integer = 5, fraction = 1) BigDecimal distanciaKm,
			@PositiveOrZero Integer subidaM) {
	}

	record ImagemRequest(
			@NotNull TipoImagem tipo,
			@NotBlank @Size(max = 500) String url,
			@NotBlank @Size(max = 255) String descricao,
			@Size(max = 120) String autor,
			@Size(max = 500) String origem) {
	}

	DadosRoteiro paraDados() {
		return new DadosRoteiro(titulo, regiao, descricao, modalidade, destino, nivel, paisagem, dias, subidaTotalM,
				altitudes,
				etapas.stream().map(e -> new Etapa(e.dia(), e.titulo(), e.distanciaKm(), e.subidaM())).toList(),
				imagens.stream().map(i -> new Imagem(i.tipo(), i.url(), i.descricao(), i.autor(), i.origem())).toList());
	}

}
