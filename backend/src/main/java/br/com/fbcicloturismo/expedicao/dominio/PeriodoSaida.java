package br.com.fbcicloturismo.expedicao.dominio;

import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import java.time.LocalDate;

/** As datas de uma {@link Saida}: início e fim da viagem e o último dia para se inscrever. */
public record PeriodoSaida(LocalDate dataInicio, LocalDate dataFim, LocalDate inscricoesAte) {

	public PeriodoSaida {
		if (dataFim.isBefore(dataInicio)) {
			throw new RegraDeNegocioException("A data de fim não pode ser anterior à data de início.");
		}
		if (inscricoesAte.isAfter(dataInicio)) {
			throw new RegraDeNegocioException("As inscrições precisam encerrar até a data de início.");
		}
	}

}
