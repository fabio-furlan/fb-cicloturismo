package br.com.fbcicloturismo.institucional.api;

import br.com.fbcicloturismo.institucional.dominio.DadosPaginaSobre;
import br.com.fbcicloturismo.institucional.dominio.FotoSobre;
import br.com.fbcicloturismo.institucional.dominio.Marco;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/** Corpo da edição da página "Sobre nós". Os limites seguem as colunas da migration V4. */
record PaginaSobreRequest(
		@NotBlank @Size(max = 120) String titulo,
		@NotBlank @Size(max = 500) String chamada,
		@NotBlank @Size(max = 20_000) String historia,
		@Size(max = 300) String citacao,
		@NotNull List<@Valid @NotNull MarcoRequest> marcos,
		@NotNull List<@Valid @NotNull FotoRequest> fotos) {

	record MarcoRequest(
			@NotBlank @Size(max = 40) String rotulo,
			@NotBlank @Size(max = 120) String titulo,
			@NotBlank @Size(max = 600) String texto) {
	}

	record FotoRequest(
			@NotBlank @Size(max = 500) String url,
			@NotBlank @Size(max = 255) String descricao,
			@Size(max = 160) String legenda) {
	}

	DadosPaginaSobre paraDados() {
		return new DadosPaginaSobre(titulo.strip(), chamada.strip(), historia.strip(), vazioComoNulo(citacao),
				marcos.stream().map(m -> new Marco(m.rotulo().strip(), m.titulo().strip(), m.texto().strip())).toList(),
				fotos.stream().map(f -> new FotoSobre(f.url().strip(), f.descricao().strip(), vazioComoNulo(f.legenda())))
						.toList());
	}

	private static String vazioComoNulo(String texto) {
		return texto == null || texto.isBlank() ? null : texto.strip();
	}

}
