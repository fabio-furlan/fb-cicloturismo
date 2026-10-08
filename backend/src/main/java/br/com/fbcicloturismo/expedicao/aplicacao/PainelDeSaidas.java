package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.compartilhado.dominio.RecursoNaoEncontradoException;
import br.com.fbcicloturismo.expedicao.infraestrutura.RoteiroRepository;
import br.com.fbcicloturismo.expedicao.infraestrutura.SaidaRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Consultas do dashboard do ADM: as saídas com status calculado e vagas vendidas sobre o total. */
@Service
@Transactional(readOnly = true)
public class PainelDeSaidas {

	private final SaidaRepository saidas;

	private final RoteiroRepository roteiros;

	private final Clock clock;

	PainelDeSaidas(SaidaRepository saidas, RoteiroRepository roteiros, Clock clock) {
		this.saidas = saidas;
		this.roteiros = roteiros;
		this.clock = clock;
	}

	/** Saídas que ainda não terminaram, da mais próxima para a mais distante. */
	public List<ResumoSaida> proximas() {
		LocalDate hoje = LocalDate.now(clock);
		return saidas.findComRoteiroTerminandoAPartirDe(hoje).stream()
				.map(saida -> ResumoSaida.de(saida, hoje))
				.toList();
	}

	/** Todas as saídas de um roteiro, inclusive as já finalizadas. */
	public List<ResumoSaida> doRoteiro(long roteiroId) {
		if (!roteiros.existsById(roteiroId)) {
			throw new RecursoNaoEncontradoException("Roteiro %d não encontrado.".formatted(roteiroId));
		}
		LocalDate hoje = LocalDate.now(clock);
		return saidas.findByRoteiroIdOrderByDataInicio(roteiroId).stream()
				.map(saida -> ResumoSaida.de(saida, hoje))
				.toList();
	}

}
