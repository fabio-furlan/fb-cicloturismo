package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.expedicao.dominio.Destino;
import br.com.fbcicloturismo.expedicao.dominio.Etapa;
import br.com.fbcicloturismo.expedicao.dominio.GrupoOpcional;
import br.com.fbcicloturismo.expedicao.dominio.Imagem;
import br.com.fbcicloturismo.expedicao.dominio.Modalidade;
import br.com.fbcicloturismo.expedicao.dominio.Nivel;
import br.com.fbcicloturismo.expedicao.dominio.Opcional;
import br.com.fbcicloturismo.expedicao.dominio.Paisagem;
import br.com.fbcicloturismo.expedicao.dominio.Roteiro;
import br.com.fbcicloturismo.expedicao.dominio.Saida;
import br.com.fbcicloturismo.expedicao.dominio.StatusSaida;
import br.com.fbcicloturismo.expedicao.dominio.TipoImagem;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

/**
 * Um roteiro como o site o mostra: o percurso e as saídas à venda. Não expõe o que é interno do ADM (rascunhos,
 * cancelamentos, capacidade e vagas ocupadas).
 *
 * @param precoAPartirDe menor preço entre as saídas abertas; sem saída aberta, o menor entre as visíveis; sem saídas,
 *                       nulo
 */
public record RoteiroPublico(
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
		List<ImagemPublica> imagens,
		BigDecimal precoAPartirDe,
		List<SaidaPublica> saidas) {

	/** A imagem sem os campos de controle de licença (autor e origem), que só interessam ao ADM. */
	public record ImagemPublica(TipoImagem tipo, String url, String descricao) {

		static ImagemPublica de(Imagem imagem) {
			return new ImagemPublica(imagem.tipo(), imagem.url(), imagem.descricao());
		}

	}

	public record SaidaPublica(Long id, LocalDate dataInicio, LocalDate dataFim, LocalDate inscricoesAte,
			int vagasRestantes, BigDecimal precoBase, StatusSaida status, List<OpcionalPublico> opcionais) {

		static SaidaPublica de(Saida saida, LocalDate hoje) {
			return new SaidaPublica(saida.getId(), saida.getDataInicio(), saida.getDataFim(), saida.getInscricoesAte(),
					saida.vagasDisponiveis(), saida.getPrecoBase(), saida.status(hoje),
					saida.getOpcionais().stream().map(OpcionalPublico::de).toList());
		}

	}

	public record OpcionalPublico(Long id, GrupoOpcional grupo, boolean escolhaUnica, String nome, String descricao,
			BigDecimal acrescimo) {

		static OpcionalPublico de(Opcional opcional) {
			return new OpcionalPublico(opcional.getId(), opcional.getGrupo(), opcional.getGrupo().escolhaUnica(),
					opcional.getNome(), opcional.getDescricao(), opcional.getAcrescimo());
		}

	}

	/** Recebe só as saídas que o site pode mostrar, já em ordem de data. */
	static RoteiroPublico de(Roteiro roteiro, List<Saida> saidasVisiveis, LocalDate hoje) {
		var saidas = saidasVisiveis.stream().map(saida -> SaidaPublica.de(saida, hoje)).toList();
		return new RoteiroPublico(
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
				roteiro.getImagens().stream().map(ImagemPublica::de).toList(),
				precoAPartirDe(saidas),
				saidas);
	}

	private static BigDecimal precoAPartirDe(List<SaidaPublica> saidas) {
		var abertas = saidas.stream().filter(saida -> saida.status() == StatusSaida.ABERTA).toList();
		return (abertas.isEmpty() ? saidas : abertas).stream()
				.map(SaidaPublica::precoBase)
				.filter(Objects::nonNull)
				.min(Comparator.naturalOrder())
				.orElse(null);
	}

}
