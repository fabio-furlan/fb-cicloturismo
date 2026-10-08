package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.expedicao.dominio.GrupoOpcional;
import br.com.fbcicloturismo.expedicao.dominio.Opcional;
import br.com.fbcicloturismo.expedicao.dominio.Saida;
import br.com.fbcicloturismo.expedicao.dominio.SituacaoSaida;
import br.com.fbcicloturismo.expedicao.dominio.StatusSaida;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/** Uma saída com seus opcionais, para a tela de edição do ADM. */
public record SaidaVisao(
		Long id,
		Long roteiroId,
		String roteiroTitulo,
		LocalDate dataInicio,
		LocalDate dataFim,
		LocalDate inscricoesAte,
		int capacidade,
		int vagasOcupadas,
		int vagasDisponiveis,
		BigDecimal precoBase,
		SituacaoSaida situacao,
		StatusSaida status,
		List<OpcionalVisao> opcionais) {

	public record OpcionalVisao(Long id, GrupoOpcional grupo, boolean escolhaUnica, String nome, String descricao,
			BigDecimal acrescimo) {

		static OpcionalVisao de(Opcional opcional) {
			return new OpcionalVisao(opcional.getId(), opcional.getGrupo(), opcional.getGrupo().escolhaUnica(),
					opcional.getNome(), opcional.getDescricao(), opcional.getAcrescimo());
		}

	}

	static SaidaVisao de(Saida saida, LocalDate hoje) {
		var roteiro = saida.getRoteiro();
		return new SaidaVisao(
				saida.getId(),
				roteiro.getId(),
				roteiro.getTitulo(),
				saida.getDataInicio(),
				saida.getDataFim(),
				saida.getInscricoesAte(),
				saida.getCapacidade(),
				saida.getVagasOcupadas(),
				saida.vagasDisponiveis(),
				saida.getPrecoBase(),
				saida.getSituacao(),
				saida.status(hoje),
				saida.getOpcionais().stream().map(OpcionalVisao::de).toList());
	}

}
