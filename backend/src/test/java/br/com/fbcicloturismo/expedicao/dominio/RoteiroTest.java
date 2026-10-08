package br.com.fbcicloturismo.expedicao.dominio;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

class RoteiroTest {

	@Test
	void distanciaTotalESomaDasEtapas() {
		Roteiro roteiro = Exemplos.roteiroAparecida();

		assertThat(roteiro.getDistanciaKm()).isEqualByComparingTo("198");
	}

	@Test
	void etapaNaoPodePassarDaDuracaoDoRoteiro() {
		var dados = comEtapas(new Etapa(4, "Dia extra", BigDecimal.TEN, null));

		assertThatThrownBy(() -> new Roteiro("aparecida", dados))
				.isInstanceOf(RegraDeNegocioException.class)
				.hasMessageContaining("dia 4");
	}

	@Test
	void naoAceitaDuasEtapasNoMesmoDia() {
		var dados = comEtapas(
				new Etapa(1, "Manhã", BigDecimal.TEN, null),
				new Etapa(1, "Tarde", BigDecimal.TEN, null));

		assertThatThrownBy(() -> new Roteiro("aparecida", dados)).isInstanceOf(RegraDeNegocioException.class);
	}

	@Test
	void aceitaSoUmBanner() {
		var base = Exemplos.dadosAparecida();
		var banner = base.imagens().getFirst();
		var dados = new DadosRoteiro(base.titulo(), base.regiao(), base.descricao(), base.modalidade(), base.destino(),
				base.nivel(), base.paisagem(), base.dias(), base.subidaTotalM(), base.altitudes(), base.etapas(),
				List.of(banner, banner));

		assertThatThrownBy(() -> new Roteiro("aparecida", dados)).isInstanceOf(RegraDeNegocioException.class);
	}

	private static DadosRoteiro comEtapas(Etapa... etapas) {
		var base = Exemplos.dadosAparecida();
		return new DadosRoteiro(base.titulo(), base.regiao(), base.descricao(), base.modalidade(), base.destino(),
				base.nivel(), base.paisagem(), base.dias(), base.subidaTotalM(), base.altitudes(), List.of(etapas),
				base.imagens());
	}

}
