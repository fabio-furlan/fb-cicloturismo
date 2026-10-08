package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.expedicao.dominio.Modalidade;
import br.com.fbcicloturismo.expedicao.dominio.Saida;
import br.com.fbcicloturismo.expedicao.dominio.StatusSaida;
import java.math.BigDecimal;
import java.time.LocalDate;

/** Uma linha do dashboard do ADM: a saída, o roteiro a que pertence e quantas vagas foram vendidas. */
public record ResumoSaida(
		Long id,
		Long roteiroId,
		String roteiroTitulo,
		Modalidade modalidade,
		LocalDate dataInicio,
		LocalDate dataFim,
		LocalDate inscricoesAte,
		int vagasOcupadas,
		int capacidade,
		BigDecimal precoBase,
		StatusSaida status) {

	static ResumoSaida de(Saida saida, LocalDate hoje) {
		var roteiro = saida.getRoteiro();
		return new ResumoSaida(
				saida.getId(),
				roteiro.getId(),
				roteiro.getTitulo(),
				roteiro.getModalidade(),
				saida.getDataInicio(),
				saida.getDataFim(),
				saida.getInscricoesAte(),
				saida.getVagasOcupadas(),
				saida.getCapacidade(),
				saida.getPrecoBase(),
				saida.status(hoje));
	}

}
