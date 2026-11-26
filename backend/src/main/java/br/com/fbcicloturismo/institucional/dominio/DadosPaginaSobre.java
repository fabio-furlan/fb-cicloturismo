package br.com.fbcicloturismo.institucional.dominio;

import java.util.List;

/**
 * Os dados editáveis da {@link PaginaSobre}.
 *
 * @param historia o texto principal; uma linha em branco separa os parágrafos
 * @param citacao  frase em destaque no meio da história; opcional
 */
public record DadosPaginaSobre(
		String titulo,
		String chamada,
		String historia,
		String citacao,
		List<Marco> marcos,
		List<FotoSobre> fotos) {
}
