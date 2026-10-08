package br.com.fbcicloturismo.expedicao.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.anonymous;

import br.com.fbcicloturismo.TestcontainersConfiguration;
import com.jayway.jsonpath.JsonPath;
import java.time.Clock;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.convention.TestBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

/**
 * A API de expedições de ponta a ponta, do ADM e do site: JSON de entrada, validação, casos de uso, banco real e respostas de erro em Problem
 * Details. "Hoje" é 20/11/2026. Por padrão as requisições são de um ADM já autenticado (o login é testado à parte); as do site são
 * anônimas.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@Transactional
@WithMockUser(roles = "ADM")
class ExpedicoesApiTest {

	private static final String ROTEIRO = """
			{
			  "titulo": "Aparecida do Norte",
			  "regiao": "São Bernardo do Campo a Aparecida, São Paulo",
			  "descricao": "Do centro de São Bernardo do Campo até a Basílica de Aparecida.",
			  "modalidade": "MTB",
			  "destino": "NACIONAL",
			  "nivel": "INTERMEDIARIO",
			  "paisagem": "FE",
			  "dias": 3,
			  "subidaTotalM": 608,
			  "altitudes": [792, 750, 730, 560],
			  "etapas": [
			    {"dia": 1, "titulo": "São Bernardo do Campo a Arujá", "distanciaKm": 56},
			    {"dia": 2, "titulo": "Arujá a São José dos Campos", "distanciaKm": 58},
			    {"dia": 3, "titulo": "São José dos Campos a Aparecida", "distanciaKm": 84, "subidaM": 210}
			  ],
			  "imagens": [
			    {"tipo": "BANNER", "url": "/images/roteiros/aparecida.jpg", "descricao": "Basílica de Aparecida"}
			  ]
			}
			""";

	private static final String SAIDA_DEZEMBRO = """
			{"dataInicio": "2026-12-12", "dataFim": "2026-12-14", "inscricoesAte": "2026-12-01",
			 "capacidade": 12, "precoBase": 1490.00}
			""";

	@TestBean
	private Clock clock;

	static Clock clock() {
		ZoneId fuso = ZoneId.of("America/Sao_Paulo");
		return Clock.fixed(ZonedDateTime.of(2026, 11, 20, 9, 0, 0, 0, fuso).toInstant(), fuso);
	}

	@Autowired
	private MockMvcTester mvc;

	private MvcTestResult post(String uri, String corpo) {
		return mvc.post().uri(uri).contentType(MediaType.APPLICATION_JSON).content(corpo).exchange();
	}

	private long criarRoteiro() throws Exception {
		return idCriado(post("/api/adm/roteiros", ROTEIRO));
	}

	private long criarSaida(long roteiroId) throws Exception {
		return idCriado(post("/api/adm/roteiros/%d/saidas".formatted(roteiroId), SAIDA_DEZEMBRO));
	}

	private static long idCriado(MvcTestResult resposta) throws Exception {
		assertThat(resposta).hasStatus(HttpStatus.CREATED);
		Number id = JsonPath.read(resposta.getResponse().getContentAsString(), "$.id");
		return id.longValue();
	}

	@Test
	void criaRoteiroComSlugEDistanciaCalculada() {
		var resposta = post("/api/adm/roteiros", ROTEIRO);

		assertThat(resposta).hasStatus(HttpStatus.CREATED).headers().containsHeader("Location");
		assertThat(resposta).bodyJson().extractingPath("$.slug").isEqualTo("aparecida-do-norte");
		assertThat(resposta).bodyJson().extractingPath("$.distanciaKm").isEqualTo(198.0);
		assertThat(resposta).bodyJson().extractingPath("$.etapas.length()").isEqualTo(3);
	}

	@Test
	void fluxoDoAdmDaCriacaoAoDashboard() throws Exception {
		long roteiroId = criarRoteiro();
		long saidaId = criarSaida(roteiroId);

		var comOpcional = post("/api/adm/saidas/%d/opcionais".formatted(saidaId),
				"""
						{"grupo": "ACOMODACAO", "nome": "Quarto individual", "acrescimo": 380.00}
						""");
		assertThat(comOpcional).hasStatusOk().bodyJson().extractingPath("$.opcionais[0].escolhaUnica").isEqualTo(true);

		var publicada = post("/api/adm/saidas/%d/publicar".formatted(saidaId), "");
		assertThat(publicada).hasStatusOk().bodyJson().extractingPath("$.status").isEqualTo("ABERTA");

		var copia = post("/api/adm/saidas/%d/duplicar".formatted(saidaId),
				"""
						{"dataInicio": "2027-10-09", "dataFim": "2027-10-11", "inscricoesAte": "2027-09-25"}
						""");
		assertThat(copia).hasStatus(HttpStatus.CREATED).bodyJson().extractingPath("$.status").isEqualTo("RASCUNHO");
		assertThat(copia).bodyJson().extractingPath("$.opcionais[0].nome").isEqualTo("Quarto individual");

		var dashboard = mvc.get().uri("/api/adm/saidas").exchange();
		assertThat(dashboard).hasStatusOk().bodyJson().extractingPath("$[*].status").asArray()
				.containsExactly("ABERTA", "RASCUNHO");
		assertThat(dashboard).bodyJson().extractingPath("$[0].capacidade").isEqualTo(12);
		assertThat(dashboard).bodyJson().extractingPath("$[0].vagasOcupadas").isEqualTo(0);
	}

	@Test
	void corpoInvalidoResponde400ComOsCampos() {
		var resposta = post("/api/adm/roteiros", """
				{"titulo": "", "dias": 0}
				""");

		assertThat(resposta).hasStatus(HttpStatus.BAD_REQUEST)
				.hasContentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON);
		assertThat(resposta).bodyJson().extractingPath("$.campos[*].campo").asArray().contains("titulo", "dias");
		assertThat(resposta).bodyJson().extractingPath("$.detail").asString().startsWith("Confira os campos.").contains("titulo");
	}

	@Test
	void regraDeNegocioResponde422() throws Exception {
		long roteiroId = criarRoteiro();

		var resposta = post("/api/adm/roteiros/%d/saidas".formatted(roteiroId), """
				{"dataInicio": "2026-12-12", "dataFim": "2026-12-10", "inscricoesAte": "2026-12-01",
				 "capacidade": 12, "precoBase": 1490.00}
				""");

		assertThat(resposta).hasStatus(HttpStatus.UNPROCESSABLE_CONTENT)
				.hasContentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON);
		assertThat(resposta).bodyJson().extractingPath("$.detail")
				.isEqualTo("A data de fim não pode ser anterior à data de início.");
	}

	@Test
	void recursoInexistenteResponde404() {
		assertThat(mvc.get().uri("/api/adm/saidas/999999").exchange()).hasStatus(HttpStatus.NOT_FOUND);
	}

	@Test
	void naoExcluiSaidaPublicada() throws Exception {
		long saidaId = criarSaida(criarRoteiro());
		post("/api/adm/saidas/%d/publicar".formatted(saidaId), "");

		assertThat(mvc.delete().uri("/api/adm/saidas/%d".formatted(saidaId)).exchange())
				.hasStatus(HttpStatus.UNPROCESSABLE_CONTENT);
	}

	@Test
	@WithAnonymousUser
	void visitanteNaoAcessaOAdm() {
		assertThat(mvc.get().uri("/api/adm/saidas").exchange()).hasStatus(HttpStatus.UNAUTHORIZED);
	}

	@Test
	void visitanteVeSoRoteirosComSaidasPublicadas() throws Exception {
		long saidaId = criarSaida(criarRoteiro());

		assertThat(comoVisitante("/api/roteiros")).hasStatusOk().bodyJson().extractingPath("$").asArray().isEmpty();
		assertThat(comoVisitante("/api/roteiros/aparecida-do-norte")).hasStatus(HttpStatus.NOT_FOUND);

		post("/api/adm/saidas/%d/publicar".formatted(saidaId), "");

		var catalogo = comoVisitante("/api/roteiros");
		assertThat(catalogo).hasStatusOk().bodyJson().extractingPath("$[0].slug").isEqualTo("aparecida-do-norte");
		assertThat(catalogo).bodyJson().extractingPath("$[0].saidas[0].vagasRestantes").isEqualTo(12);
		assertThat(catalogo).bodyJson().extractingPath("$[0].saidas[0].status").isEqualTo("ABERTA");
		assertThat(catalogo).bodyJson().doesNotHavePath("$[0].saidas[0].capacidade");
		assertThat(comoVisitante("/api/roteiros/aparecida-do-norte")).hasStatusOk();
	}

	/** GET anônimo, como um visitante do site, sem afetar o ADM autenticado das outras requisições do teste. */
	private MvcTestResult comoVisitante(String uri) {
		return mvc.get().uri(uri).with(anonymous()).exchange();
	}

}
