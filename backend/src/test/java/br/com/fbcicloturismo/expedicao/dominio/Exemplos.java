package br.com.fbcicloturismo.expedicao.dominio;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/** Objetos de domínio prontos para os testes. */
public final class Exemplos {

	private Exemplos() {
	}

	public static DadosRoteiro dadosAparecida() {
		return new DadosRoteiro(
				"Aparecida do Norte",
				"São Bernardo do Campo a Aparecida, São Paulo",
				"Do centro de São Bernardo do Campo até a Basílica de Aparecida.",
				Modalidade.MTB,
				Destino.NACIONAL,
				Nivel.INTERMEDIARIO,
				Paisagem.FE,
				3,
				608,
				new int[] {792, 750, 730, 560},
				List.of(
						new Etapa(1, "São Bernardo do Campo a Arujá", new BigDecimal("56"), null),
						new Etapa(2, "Arujá a São José dos Campos", new BigDecimal("58"), null),
						new Etapa(3, "São José dos Campos a Aparecida", new BigDecimal("84"), 210)),
				List.of(
						new Imagem(TipoImagem.BANNER, "/images/roteiros/aparecida.jpg", "Basílica de Aparecida",
								"Damáris Gonçalves", "https://unsplash.com/photos/Z2SkdxHaQz8")));
	}

	public static Roteiro roteiroAparecida() {
		return new Roteiro("aparecida", dadosAparecida());
	}

	/** Saída de 12 a 14/12/2026, inscrições até 01/12, 12 vagas a R$ 1.490. */
	public static Saida saidaDezembro(Roteiro roteiro) {
		var periodo = new PeriodoSaida(LocalDate.of(2026, 12, 12), LocalDate.of(2026, 12, 14), LocalDate.of(2026, 12, 1));
		return new Saida(roteiro, periodo, 12, new BigDecimal("1490.00"));
	}

}
