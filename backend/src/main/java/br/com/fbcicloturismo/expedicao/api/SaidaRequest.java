package br.com.fbcicloturismo.expedicao.api;

import br.com.fbcicloturismo.expedicao.aplicacao.DadosSaida;
import br.com.fbcicloturismo.expedicao.dominio.PeriodoSaida;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;

/** Corpo da criação e da edição de uma saída. */
record SaidaRequest(
		@NotNull LocalDate dataInicio,
		@NotNull LocalDate dataFim,
		@NotNull LocalDate inscricoesAte,
		@Positive int capacidade,
		@NotNull @PositiveOrZero @Digits(integer = 8, fraction = 2) BigDecimal precoBase) {

	DadosSaida paraDados() {
		return new DadosSaida(new PeriodoSaida(dataInicio, dataFim, inscricoesAte), capacidade, precoBase);
	}

}
