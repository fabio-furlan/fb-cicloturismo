package br.com.fbcicloturismo.expedicao.aplicacao;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.fbcicloturismo.TestcontainersConfiguration;
import br.com.fbcicloturismo.compartilhado.dominio.RecursoNaoEncontradoException;
import br.com.fbcicloturismo.expedicao.dominio.DadosRoteiro;
import br.com.fbcicloturismo.expedicao.dominio.Exemplos;
import br.com.fbcicloturismo.expedicao.dominio.PeriodoSaida;
import br.com.fbcicloturismo.expedicao.dominio.Saida;
import br.com.fbcicloturismo.expedicao.dominio.StatusSaida;
import br.com.fbcicloturismo.expedicao.infraestrutura.SaidaRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

/** O que o site enxerga, com "hoje" fixo em 20/11/2026. */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({ TestcontainersConfiguration.class, CatalogoPublicoTest.RelogioFixo.class, GestaoDeRoteiros.class,
		GestaoDeSaidas.class, CatalogoPublico.class })
class CatalogoPublicoTest {

	private static final LocalDate HOJE = LocalDate.of(2026, 11, 20);

	@TestConfiguration
	static class RelogioFixo {

		@Bean
		Clock clock() {
			ZoneId fuso = ZoneId.of("America/Sao_Paulo");
			return Clock.fixed(ZonedDateTime.of(HOJE, LocalTime.NOON, fuso).toInstant(), fuso);
		}

	}

	@Autowired
	private GestaoDeRoteiros gestaoDeRoteiros;

	@Autowired
	private GestaoDeSaidas gestaoDeSaidas;

	@Autowired
	private CatalogoPublico catalogo;

	@Autowired
	private SaidaRepository saidas;

	private static DadosRoteiro roteiroChamado(String titulo) {
		var base = Exemplos.dadosAparecida();
		return new DadosRoteiro(titulo, base.regiao(), base.descricao(), base.modalidade(), base.destino(),
				base.nivel(), base.paisagem(), base.dias(), base.subidaTotalM(), base.altitudes(), base.etapas(),
				base.imagens());
	}

	private static DadosSaida saidaEm(LocalDate inicio, String preco) {
		return new DadosSaida(new PeriodoSaida(inicio, inicio.plusDays(2), inicio.minusDays(10)), 12,
				new BigDecimal(preco));
	}

	private long publicada(long roteiroId, LocalDate inicio, String preco) {
		long id = gestaoDeSaidas.criar(roteiroId, saidaEm(inicio, preco)).id();
		gestaoDeSaidas.publicar(id);
		return id;
	}

	@Test
	void mostraSoSaidasPublicadasQueAindaNaoComecaram() {
		long roteiro = gestaoDeRoteiros.criar(roteiroChamado("Aparecida do Norte")).id();
		publicada(roteiro, LocalDate.of(2026, 10, 9), "1390.00");
		long dezembro = publicada(roteiro, LocalDate.of(2026, 12, 12), "1490.00");
		gestaoDeSaidas.criar(roteiro, saidaEm(LocalDate.of(2027, 1, 15), "1490.00"));
		long cancelada = publicada(roteiro, LocalDate.of(2027, 2, 15), "1490.00");
		gestaoDeSaidas.cancelar(cancelada);

		assertThat(catalogo.roteiros()).singleElement().satisfies(publico -> {
			assertThat(publico.slug()).isEqualTo("aparecida-do-norte");
			assertThat(publico.saidas()).extracting(RoteiroPublico.SaidaPublica::id).containsExactly(dezembro);
			assertThat(publico.saidas().getFirst().vagasRestantes()).isEqualTo(12);
			assertThat(publico.precoAPartirDe()).isEqualByComparingTo("1490.00");
		});
	}

	@Test
	void ordenaPelaSaidaMaisProxima() {
		long serra = gestaoDeRoteiros.criar(roteiroChamado("Serra da Mantiqueira")).id();
		long aparecida = gestaoDeRoteiros.criar(roteiroChamado("Aparecida do Norte")).id();
		publicada(serra, LocalDate.of(2027, 3, 1), "2100.00");
		publicada(aparecida, LocalDate.of(2026, 12, 12), "1490.00");

		assertThat(catalogo.roteiros()).extracting(RoteiroPublico::slug)
				.containsExactly("aparecida-do-norte", "serra-da-mantiqueira");
	}

	@Test
	void precoAPartirDeConsideraSoAsSaidasAbertas() {
		long roteiro = gestaoDeRoteiros.criar(roteiroChamado("Aparecida do Norte")).id();
		long esgotada = publicada(roteiro, LocalDate.of(2026, 12, 12), "990.00");
		Saida saida = saidas.findById(esgotada).orElseThrow();
		saida.reservarVagas(12, HOJE);
		publicada(roteiro, LocalDate.of(2027, 1, 15), "1490.00");

		var publico = catalogo.roteiro("aparecida-do-norte");

		assertThat(publico.saidas()).extracting(RoteiroPublico.SaidaPublica::status)
				.containsExactly(StatusSaida.ESGOTADA, StatusSaida.ABERTA);
		assertThat(publico.precoAPartirDe()).isEqualByComparingTo("1490.00");
	}

	@Test
	void roteiroSoEmRascunhoNaoExisteParaOSite() {
		long roteiro = gestaoDeRoteiros.criar(roteiroChamado("Aparecida do Norte")).id();
		gestaoDeSaidas.criar(roteiro, saidaEm(LocalDate.of(2026, 12, 12), "1490.00"));

		assertThat(catalogo.roteiros()).isEmpty();
		assertThatThrownBy(() -> catalogo.roteiro("aparecida-do-norte"))
				.isInstanceOf(RecursoNaoEncontradoException.class);
	}

	@Test
	void roteiroComSaidasPassadasContinuaAcessivelPeloSlug() {
		long roteiro = gestaoDeRoteiros.criar(roteiroChamado("Aparecida do Norte")).id();
		publicada(roteiro, LocalDate.of(2026, 10, 9), "1390.00");

		assertThat(catalogo.roteiros()).isEmpty();
		var publico = catalogo.roteiro("aparecida-do-norte");
		assertThat(publico.saidas()).isEmpty();
		assertThat(publico.precoAPartirDe()).isNull();
	}

}
