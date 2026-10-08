package br.com.fbcicloturismo.expedicao.aplicacao;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SlugsTest {

	@Test
	void tiraAcentosPontuacaoEMaiusculas() {
		assertThat(Slugs.de("Serra da Mantiqueira, 2ª edição")).isEqualTo("serra-da-mantiqueira-2-edicao");
		assertThat(Slugs.de("  Caminho da Fé — São João  ")).isEqualTo("caminho-da-fe-sao-joao");
	}

	@Test
	void cortaTitulosLongosSemTerminarEmHifen() {
		String slug = Slugs.de("Travessia ".repeat(12));

		assertThat(slug).hasSizeLessThanOrEqualTo(Slugs.TAMANHO_MAXIMO).doesNotEndWith("-");
	}

	@Test
	void textoSemLetrasNemNumerosViraRoteiro() {
		assertThat(Slugs.de("!!!")).isEqualTo("roteiro");
	}

}
