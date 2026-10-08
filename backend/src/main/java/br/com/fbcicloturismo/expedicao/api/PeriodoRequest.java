package br.com.fbcicloturismo.expedicao.api;

import br.com.fbcicloturismo.expedicao.dominio.PeriodoSaida;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/** Datas de uma saída. A coerência entre elas (fim depois do início, etc.) é regra do domínio e responde 422. */
record PeriodoRequest(@NotNull LocalDate dataInicio, @NotNull LocalDate dataFim, @NotNull LocalDate inscricoesAte) {

	PeriodoSaida paraPeriodo() {
		return new PeriodoSaida(dataInicio, dataFim, inscricoesAte);
	}

}
