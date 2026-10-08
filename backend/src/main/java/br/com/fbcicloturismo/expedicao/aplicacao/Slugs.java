package br.com.fbcicloturismo.expedicao.aplicacao;

import java.text.Normalizer;
import java.util.Locale;

/** Gera o identificador de URL a partir de um texto: "Serra da Mantiqueira, 2ª edição" vira "serra-da-mantiqueira-2-edicao". */
final class Slugs {

	/** A coluna tem 80 caracteres; a folga cabe o sufixo de desempate ("-2", "-15"). */
	static final int TAMANHO_MAXIMO = 72;

	private Slugs() {
	}

	static String de(String texto) {
		String semAcentos = Normalizer.normalize(texto, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
		String slug = semAcentos.toLowerCase(Locale.ROOT)
				.replaceAll("[^a-z0-9]+", "-")
				.replaceAll("(^-|-$)", "");
		if (slug.length() > TAMANHO_MAXIMO) {
			slug = slug.substring(0, TAMANHO_MAXIMO).replaceAll("-$", "");
		}
		return slug.isEmpty() ? "roteiro" : slug;
	}

}
