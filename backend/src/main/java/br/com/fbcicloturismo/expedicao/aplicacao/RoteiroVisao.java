package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.expedicao.dominio.Destino;
import br.com.fbcicloturismo.expedicao.dominio.Etapa;
import br.com.fbcicloturismo.expedicao.dominio.Imagem;
import br.com.fbcicloturismo.expedicao.dominio.Modalidade;
import br.com.fbcicloturismo.expedicao.dominio.Nivel;
import br.com.fbcicloturismo.expedicao.dominio.Paisagem;
import br.com.fbcicloturismo.expedicao.dominio.Roteiro;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/** Um roteiro completo, montado dentro da transação para não depender de carregamento tardio fora dela. */
public record RoteiroVisao(
		Long id,
		String slug,
		String titulo,
		String regiao,
		String descricao,
		Modalidade modalidade,
		Destino destino,
		Nivel nivel,
		Paisagem paisagem,
		int dias,
		BigDecimal distanciaKm,
		int subidaTotalM,
		int[] altitudes,
		List<Etapa> etapas,
		List<Imagem> imagens,
		Instant criadoEm,
		Instant atualizadoEm) {

	static RoteiroVisao de(Roteiro roteiro) {
		return new RoteiroVisao(
				roteiro.getId(),
				roteiro.getSlug(),
				roteiro.getTitulo(),
				roteiro.getRegiao(),
				roteiro.getDescricao(),
				roteiro.getModalidade(),
				roteiro.getDestino(),
				roteiro.getNivel(),
				roteiro.getPaisagem(),
				roteiro.getDias(),
				roteiro.getDistanciaKm(),
				roteiro.getSubidaTotalM(),
				roteiro.getAltitudes(),
				roteiro.getEtapas(),
				roteiro.getImagens(),
				roteiro.getCriadoEm(),
				roteiro.getAtualizadoEm());
	}

}
