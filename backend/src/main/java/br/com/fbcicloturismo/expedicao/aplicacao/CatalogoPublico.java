package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.compartilhado.dominio.RecursoNaoEncontradoException;
import br.com.fbcicloturismo.expedicao.dominio.Roteiro;
import br.com.fbcicloturismo.expedicao.dominio.Saida;
import br.com.fbcicloturismo.expedicao.dominio.SituacaoSaida;
import br.com.fbcicloturismo.expedicao.infraestrutura.RoteiroRepository;
import br.com.fbcicloturismo.expedicao.infraestrutura.SaidaRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * O que o site mostra a qualquer visitante. Uma saída é visível quando está publicada e ainda não começou (aberta,
 * esgotada ou com inscrições encerradas); rascunhos e cancelamentos nunca aparecem.
 */
@Service
@Transactional(readOnly = true)
public class CatalogoPublico {

	private final RoteiroRepository roteiros;

	private final SaidaRepository saidas;

	private final Clock clock;

	CatalogoPublico(RoteiroRepository roteiros, SaidaRepository saidas, Clock clock) {
		this.roteiros = roteiros;
		this.saidas = saidas;
		this.clock = clock;
	}

	/** Roteiros com alguma saída visível, ordenados pela saída mais próxima. */
	public List<RoteiroPublico> roteiros() {
		LocalDate hoje = LocalDate.now(clock);
		var saidasPorRoteiro = new LinkedHashMap<Long, List<Saida>>();
		var roteirosPorId = new LinkedHashMap<Long, Roteiro>();
		for (Saida saida : saidas.findPublicadasComRoteiroIniciandoDepoisDe(hoje)) {
			Roteiro roteiro = saida.getRoteiro();
			roteirosPorId.putIfAbsent(roteiro.getId(), roteiro);
			saidasPorRoteiro.computeIfAbsent(roteiro.getId(), id -> new ArrayList<>()).add(saida);
		}
		return roteirosPorId.values().stream()
				.map(roteiro -> RoteiroPublico.de(roteiro, saidasPorRoteiro.get(roteiro.getId()), hoje))
				.toList();
	}

	/**
	 * Um roteiro pelo slug, com as saídas visíveis. Continua acessível depois que as saídas passam, para não quebrar
	 * links já divulgados; só é 404 se nunca teve saída publicada (um roteiro ainda em preparo no ADM).
	 */
	public RoteiroPublico roteiro(String slug) {
		var roteiro = roteiros.findBySlug(slug)
				.filter(encontrado -> saidas.existsByRoteiroIdAndSituacao(encontrado.getId(), SituacaoSaida.PUBLICADA))
				.orElseThrow(() -> new RecursoNaoEncontradoException("Roteiro \"%s\" não encontrado.".formatted(slug)));
		LocalDate hoje = LocalDate.now(clock);
		var visiveis = saidas.findByRoteiroIdAndSituacaoAndDataInicioAfterOrderByDataInicio(roteiro.getId(),
				SituacaoSaida.PUBLICADA, hoje);
		return RoteiroPublico.de(roteiro, visiveis, hoje);
	}

}
