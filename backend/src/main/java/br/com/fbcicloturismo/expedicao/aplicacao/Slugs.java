package br.com.fbcicloturismo.expedicao.aplicacao;

import java.text.Normalizer;
import java.util.Locale;

/** Gera o identificador de URL a partir de um texto: "Serra da Mantiqueira, 2ª edição" vira "serra-da-mantiqueira-2-edicao". */
final class Slugs {

	private Slugs() {
	}

	static String de(String texto) {
		String semAcentos = Normalizer.normalize(texto, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
		String slug = semAcentos.toLowerCase(Locale.ROOT)
				.replaceAll("[^a-z0-9]+", "-")
				.replaceAll("(^-|-$)", "");
		return slug.isEmpty() ? "roteiro" : slug;
	}

}
