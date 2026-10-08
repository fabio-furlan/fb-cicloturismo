package br.com.fbcicloturismo.expedicao.aplicacao;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.tuple;

import br.com.fbcicloturismo.TestcontainersConfiguration;
import br.com.fbcicloturismo.compartilhado.dominio.RecursoNaoEncontradoException;
import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import br.com.fbcicloturismo.expedicao.dominio.DadosRoteiro;
import br.com.fbcicloturismo.expedicao.dominio.Exemplos;
import br.com.fbcicloturismo.expedicao.dominio.GrupoOpcional;
import br.com.fbcicloturismo.expedicao.dominio.PeriodoSaida;
import br.com.fbcicloturismo.expedicao.dominio.SituacaoSaida;
import br.com.fbcicloturismo.expedicao.dominio.StatusSaida;
import br.com.fbcicloturismo.expedicao.infraestrutura.SaidaRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

/** Casos de uso do ADM contra um PostgreSQL real, com "hoje" fixo em 20/11/2026. */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({ TestcontainersConfiguration.class, CasosDeUsoExpedicaoTest.RelogioFixo.class, GestaoDeRoteiros.class,
		GestaoDeSaidas.class, PainelDeSaidas.class })
class CasosDeUsoExpedicaoTest {

	private static final DadosSaida DEZEMBRO = new DadosSaida(
			new PeriodoSaida(LocalDate.of(2026, 12, 12), LocalDate.of(2026, 12, 14), LocalDate.of(2026, 12, 1)),
			12, new BigDecimal("1490.00"));

	private static final PeriodoSaida OUTUBRO_2027 =
			new PeriodoSaida(LocalDate.of(2027, 10, 9), LocalDate.of(2027, 10, 11), LocalDate.of(2027, 9, 25));

	@TestConfiguration
	static class RelogioFixo {

		@Bean
		Clock clock() {
			ZoneId fuso = ZoneId.of("America/Sao_Paulo");
			return Clock.fixed(ZonedDateTime.of(2026, 11, 20, 9, 0, 0, 0, fuso).toInstant(), fuso);
		}

	}

	@Autowired
	private GestaoDeRoteiros gestaoDeRoteiros;

	@Autowired
	private GestaoDeSaidas gestaoDeSaidas;

	@Autowired
	private PainelDeSaidas painel;

	@Autowired
	private SaidaRepository saidas;

	@Autowired
	private EntityManager entityManager;

	private void gravarEEsquecer() {
		entityManager.flush();
		entityManager.clear();
	}

	@Nested
	class Roteiros {

		@Test
		void criaComSlugDoTituloSemRepetir() {
			var primeiro = gestaoDeRoteiros.criar(Exemplos.dadosAparecida());
			var segundo = gestaoDeRoteiros.criar(Exemplos.dadosAparecida());

			assertThat(primeiro.slug()).isEqualTo("aparecida-do-norte");
			assertThat(segundo.slug()).isEqualTo("aparecida-do-norte-2");
			assertThat(primeiro.distanciaKm()).isEqualByComparingTo("198");
		}

		@Test
		void atualizarMantemOSlug() {
			var criado = gestaoDeRoteiros.criar(Exemplos.dadosAparecida());
			var dados = Exemplos.dadosAparecida();
			var novosDados = new DadosRoteiro("Rumo a Aparecida",
					dados.regiao(), dados.descricao(), dados.modalidade(), dados.destino(), dados.nivel(),
					dados.paisagem(), dados.dias(), dados.subidaTotalM(), dados.altitudes(), dados.etapas(),
					dados.imagens());

			gestaoDeRoteiros.atualizar(criado.id(), novosDados);
			gravarEEsquecer();

			var lido = gestaoDeRoteiros.buscar(criado.id());
			assertThat(lido.titulo()).isEqualTo("Rumo a Aparecida");
			assertThat(lido.slug()).isEqualTo("aparecida-do-norte");
		}

		@Test
		void naoExcluiRoteiroComSaidas() {
			var roteiro = gestaoDeRoteiros.criar(Exemplos.dadosAparecida());
			gestaoDeSaidas.criar(roteiro.id(), DEZEMBRO);

			assertThatThrownBy(() -> gestaoDeRoteiros.excluir(roteiro.id()))
					.isInstanceOf(RegraDeNegocioException.class);
		}

		@Test
		void excluiRoteiroSemSaidas() {
			var roteiro = gestaoDeRoteiros.criar(Exemplos.dadosAparecida());

			gestaoDeRoteiros.excluir(roteiro.id());

			assertThatThrownBy(() -> gestaoDeRoteiros.buscar(roteiro.id()))
					.isInstanceOf(RecursoNaoEncontradoException.class);
		}

	}

	@Nested
	class Saidas {

		@Test
		void criaComoRascunhoEPublica() {
			var roteiro = gestaoDeRoteiros.criar(Exemplos.dadosAparecida());

			var criada = gestaoDeSaidas.criar(roteiro.id(), DEZEMBRO);
			assertThat(criada.status()).isEqualTo(StatusSaida.RASCUNHO);

			var publicada = gestaoDeSaidas.publicar(criada.id());
			assertThat(publicada.status()).isEqualTo(StatusSaida.ABERTA);
			assertThat(publicada.vagasDisponiveis()).isEqualTo(12);
		}

		@Test
		void naoCriaSaidaDeRoteiroInexistente() {
			assertThatThrownBy(() -> gestaoDeSaidas.criar(999L, DEZEMBRO))
					.isInstanceOf(RecursoNaoEncontradoException.class);
		}

		@Test
		void adicionaERemoveOpcionais() {
			var roteiro = gestaoDeRoteiros.criar(Exemplos.dadosAparecida());
			var saida = gestaoDeSaidas.criar(roteiro.id(), DEZEMBRO);

			var comOpcional = gestaoDeSaidas.adicionarOpcional(saida.id(),
					new NovoOpcional(GrupoOpcional.ACOMODACAO, "Quarto individual", null, new BigDecimal("380.00")));
			var opcional = comOpcional.opcionais().getFirst();
			assertThat(opcional.id()).isNotNull();
			assertThat(opcional.escolhaUnica()).isTrue();

			gravarEEsquecer();
			var semOpcional = gestaoDeSaidas.removerOpcional(saida.id(), opcional.id());
			assertThat(semOpcional.opcionais()).isEmpty();
		}

		@Test
		void duplicaComOpcionaisParaNovasDatas() {
			var roteiro = gestaoDeRoteiros.criar(Exemplos.dadosAparecida());
			var original = gestaoDeSaidas.criar(roteiro.id(), DEZEMBRO);
			gestaoDeSaidas.adicionarOpcional(original.id(),
					new NovoOpcional(GrupoOpcional.EQUIPAMENTO, "Aluguel de bike", null, new BigDecimal("250.00")));
			gestaoDeSaidas.publicar(original.id());
			gravarEEsquecer();

			var copia = gestaoDeSaidas.duplicar(original.id(), OUTUBRO_2027);
			gravarEEsquecer();

			var lida = gestaoDeSaidas.buscar(copia.id());
			assertThat(lida.id()).isNotEqualTo(original.id());
			assertThat(lida.situacao()).isEqualTo(SituacaoSaida.RASCUNHO);
			assertThat(lida.dataInicio()).isEqualTo(LocalDate.of(2027, 10, 9));
			assertThat(lida.opcionais()).extracting(SaidaVisao.OpcionalVisao::nome, SaidaVisao.OpcionalVisao::acrescimo)
					.containsExactly(tuple("Aluguel de bike", new BigDecimal("250.00")));
		}

		@Test
		void soExcluiRascunho() {
			var roteiro = gestaoDeRoteiros.criar(Exemplos.dadosAparecida());
			var rascunho = gestaoDeSaidas.criar(roteiro.id(), DEZEMBRO);
			var publicada = gestaoDeSaidas.criar(roteiro.id(), DEZEMBRO);
			gestaoDeSaidas.publicar(publicada.id());

			gestaoDeSaidas.excluir(rascunho.id());

			assertThat(saidas.existsById(rascunho.id())).isFalse();
			assertThatThrownBy(() -> gestaoDeSaidas.excluir(publicada.id()))
					.isInstanceOf(RegraDeNegocioException.class);
		}

	}

	@Nested
	class Painel {

		@Test
		void listaSaidasNaoTerminadasComStatusEVagas() {
			var roteiro = gestaoDeRoteiros.criar(Exemplos.dadosAparecida());
			var passada = gestaoDeSaidas.criar(roteiro.id(), new DadosSaida(
					new PeriodoSaida(LocalDate.of(2026, 10, 9), LocalDate.of(2026, 10, 11), LocalDate.of(2026, 9, 25)),
					12, new BigDecimal("1390.00")));
			gestaoDeSaidas.publicar(passada.id());
			var dezembro = gestaoDeSaidas.criar(roteiro.id(), DEZEMBRO);
			gestaoDeSaidas.publicar(dezembro.id());
			gestaoDeSaidas.duplicar(dezembro.id(), OUTUBRO_2027);
			gravarEEsquecer();

			assertThat(painel.proximas())
					.extracting(ResumoSaida::dataInicio, ResumoSaida::status, ResumoSaida::roteiroTitulo)
					.containsExactly(
							tuple(LocalDate.of(2026, 12, 12), StatusSaida.ABERTA, "Aparecida do Norte"),
							tuple(LocalDate.of(2027, 10, 9), StatusSaida.RASCUNHO, "Aparecida do Norte"));
			assertThat(painel.doRoteiro(roteiro.id()))
					.extracting(ResumoSaida::status)
					.containsExactly(StatusSaida.FINALIZADA, StatusSaida.ABERTA, StatusSaida.RASCUNHO);
		}

	}

}
