package br.com.fbcicloturismo.expedicao.dominio;

import java.util.List;

/** Os dados editáveis de um {@link Roteiro}. A distância total é calculada a partir das etapas. */
public record DadosRoteiro(
		String titulo,
		String regiao,
		String descricao,
		Modalidade modalidade,
		Destino destino,
		Nivel nivel,
		Paisagem paisagem,
		int dias,
		int subidaTotalM,
		int[] altitudes,
		List<Etapa> etapas,
		List<Imagem> imagens) {
}
