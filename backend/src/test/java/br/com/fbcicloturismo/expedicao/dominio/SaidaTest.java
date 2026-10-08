package br.com.fbcicloturismo.expedicao.dominio;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.tuple;

import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class SaidaTest {

	private static final LocalDate ANTES_DAS_INSCRICOES_ENCERRAREM = LocalDate.of(2026, 11, 20);

	private final Saida saida = Exemplos.saidaDezembro(Exemplos.roteiroAparecida());

	@Nested
	class Status {

		@Test
		void nasceComoRascunho() {
			assertThat(saida.status(ANTES_DAS_INSCRICOES_ENCERRAREM)).isEqualTo(StatusSaida.RASCUNHO);
		}

		@Test
		void publicadaComVagasEDentroDoPrazoEstaAberta() {
			saida.publicar();

			assertThat(saida.status(ANTES_DAS_INSCRICOES_ENCERRAREM)).isEqualTo(StatusSaida.ABERTA);
			assertThat(saida.status(LocalDate.of(2026, 12, 1))).isEqualTo(StatusSaida.ABERTA);
		}

		@Test
		void depoisDoPrazoDeInscricaoEstaComInscricoesEncerradas() {
			saida.publicar();

			assertThat(saida.status(LocalDate.of(2026, 12, 2))).isEqualTo(StatusSaida.INSCRICOES_ENCERRADAS);
		}

		@Test
		void semVagasEstaEsgotada() {
			saida.publicar();
			saida.reservarVagas(12, ANTES_DAS_INSCRICOES_ENCERRAREM);

			assertThat(saida.status(ANTES_DAS_INSCRICOES_ENCERRAREM)).isEqualTo(StatusSaida.ESGOTADA);
			assertThat(saida.status(LocalDate.of(2026, 12, 5))).isEqualTo(StatusSaida.ESGOTADA);
		}

		@Test
		void entreInicioEFimEstaEmAndamento() {
			saida.publicar();

			assertThat(saida.status(LocalDate.of(2026, 12, 12))).isEqualTo(StatusSaida.EM_ANDAMENTO);
			assertThat(saida.status(LocalDate.of(2026, 12, 14))).isEqualTo(StatusSaida.EM_ANDAMENTO);
		}

		@Test
		void depoisDoFimEstaFinalizada() {
			saida.publicar();

			assertThat(saida.status(LocalDate.of(2026, 12, 15))).isEqualTo(StatusSaida.FINALIZADA);
		}

		@Test
		void canceladaContinuaCanceladaEmQualquerData() {
			saida.publicar();
			saida.cancelar();

			assertThat(saida.status(ANTES_DAS_INSCRICOES_ENCERRAREM)).isEqualTo(StatusSaida.CANCELADA);
			assertThat(saida.status(LocalDate.of(2026, 12, 15))).isEqualTo(StatusSaida.CANCELADA);
		}

		@Test
		void canceladaNaoPodeSerPublicada() {
			saida.cancelar();

			assertThatThrownBy(saida::publicar).isInstanceOf(RegraDeNegocioException.class);
		}

	}

	@Nested
	class Vagas {

		@Test
		void reservaOcupaVagas() {
			saida.publicar();

			saida.reservarVagas(3, ANTES_DAS_INSCRICOES_ENCERRAREM);

			assertThat(saida.getVagasOcupadas()).isEqualTo(3);
			assertThat(saida.vagasDisponiveis()).isEqualTo(9);
		}

		@Test
		void naoReservaAlemDaCapacidade() {
			saida.publicar();
			saida.reservarVagas(10, ANTES_DAS_INSCRICOES_ENCERRAREM);

			assertThatThrownBy(() -> saida.reservarVagas(3, ANTES_DAS_INSCRICOES_ENCERRAREM))
					.isInstanceOf(RegraDeNegocioException.class)
					.hasMessageContaining("Restam só 2 vagas");
			assertThat(saida.getVagasOcupadas()).isEqualTo(10);
		}

		@Test
		void naoReservaEmRascunho() {
			assertThatThrownBy(() -> saida.reservarVagas(1, ANTES_DAS_INSCRICOES_ENCERRAREM))
					.isInstanceOf(RegraDeNegocioException.class);
		}

		@Test
		void naoReservaDepoisDoPrazoDeInscricao() {
			saida.publicar();

			assertThatThrownBy(() -> saida.reservarVagas(1, LocalDate.of(2026, 12, 2)))
					.isInstanceOf(RegraDeNegocioException.class);
		}

		@Test
		void liberarDevolveVagas() {
			saida.publicar();
			saida.reservarVagas(4, ANTES_DAS_INSCRICOES_ENCERRAREM);

			saida.liberarVagas(4);

			assertThat(saida.vagasDisponiveis()).isEqualTo(12);
		}

		@Test
		void capacidadeNaoFicaAbaixoDasVagasOcupadas() {
			saida.publicar();
			saida.reservarVagas(8, ANTES_DAS_INSCRICOES_ENCERRAREM);
			var mesmoPeriodo = new PeriodoSaida(saida.getDataInicio(), saida.getDataFim(), saida.getInscricoesAte());

			assertThatThrownBy(() -> saida.alterar(mesmoPeriodo, 6, saida.getPrecoBase()))
					.isInstanceOf(RegraDeNegocioException.class);
		}

	}

	@Nested
	class Duplicacao {

		@Test
		void copiaCapacidadePrecoEOpcionaisParaNovasDatasComoRascunho() {
			saida.adicionarOpcional(GrupoOpcional.ACOMODACAO, "Quarto individual", null, new BigDecimal("380.00"));
			saida.adicionarOpcional(GrupoOpcional.EQUIPAMENTO, "Aluguel de bike", "MTB aro 29", new BigDecimal("250.00"));
			saida.publicar();
			saida.reservarVagas(5, ANTES_DAS_INSCRICOES_ENCERRAREM);
			var outubro = new PeriodoSaida(LocalDate.of(2027, 10, 9), LocalDate.of(2027, 10, 11), LocalDate.of(2027, 9, 25));

			Saida copia = saida.duplicarPara(outubro);

			assertThat(copia.getRoteiro()).isSameAs(saida.getRoteiro());
			assertThat(copia.getDataInicio()).isEqualTo(LocalDate.of(2027, 10, 9));
			assertThat(copia.getCapacidade()).isEqualTo(12);
			assertThat(copia.getVagasOcupadas()).isZero();
			assertThat(copia.getPrecoBase()).isEqualByComparingTo("1490");
			assertThat(copia.getSituacao()).isEqualTo(SituacaoSaida.RASCUNHO);
			assertThat(copia.getOpcionais())
					.extracting(Opcional::getNome, Opcional::getSaida)
					.containsExactly(
							tuple("Quarto individual", copia),
							tuple("Aluguel de bike", copia));
		}

	}

	@Nested
	class Opcionais {

		@Test
		void naoAceitaNomeRepetidoNoMesmoGrupo() {
			saida.adicionarOpcional(GrupoOpcional.ACOMODACAO, "Quarto individual", null, new BigDecimal("380.00"));

			assertThatThrownBy(() -> saida.adicionarOpcional(
					GrupoOpcional.ACOMODACAO, "quarto individual", null, new BigDecimal("400.00")))
					.isInstanceOf(RegraDeNegocioException.class);
		}

		@Test
		void ordenaPelaOrdemDeCadastroDentroDoGrupo() {
			saida.adicionarOpcional(GrupoOpcional.ACOMODACAO, "Quarto duplo", null, BigDecimal.ZERO);
			var individual = saida.adicionarOpcional(
					GrupoOpcional.ACOMODACAO, "Quarto individual", null, new BigDecimal("380.00"));

			assertThat(individual.getOrdem()).isEqualTo(1);
		}

	}

	@Nested
	class Periodo {

		@Test
		void fimNaoPodeSerAntesDoInicio() {
			assertThatThrownBy(() -> new PeriodoSaida(
					LocalDate.of(2026, 12, 14), LocalDate.of(2026, 12, 12), LocalDate.of(2026, 12, 1)))
					.isInstanceOf(RegraDeNegocioException.class);
		}

		@Test
		void inscricoesNaoPodemEncerrarDepoisDoInicio() {
			assertThatThrownBy(() -> new PeriodoSaida(
					LocalDate.of(2026, 12, 12), LocalDate.of(2026, 12, 14), LocalDate.of(2026, 12, 13)))
					.isInstanceOf(RegraDeNegocioException.class);
		}

	}

}
