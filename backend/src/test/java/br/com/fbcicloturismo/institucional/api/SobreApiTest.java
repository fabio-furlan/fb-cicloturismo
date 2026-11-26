package br.com.fbcicloturismo.institucional.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.anonymous;

import br.com.fbcicloturismo.TestcontainersConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

/**
 * A página "Sobre nós" de ponta a ponta: o ADM salva e o site lê. Por padrão as requisições são de um ADM; as do site
 * são anônimas.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@Transactional
@WithMockUser(roles = "ADM")
class SobreApiTest {

	private static final String PAGINA = """
			{
			  "titulo": "Entre o código e a estrada",
			  "chamada": "Programador por ofício, ciclista por teimosia.",
			  "historia": "Primeiro parágrafo.\\n\\nSegundo parágrafo.",
			  "citacao": "  ",
			  "marcos": [
			    {"rotulo": "Hoje", "titulo": "Fábio Cicloturismo", "texto": "O laboratório."}
			  ],
			  "fotos": [
			    {"url": "/images/hero-bikepacking.jpg", "descricao": "Bicicleta carregada ao pôr do sol", "legenda": "Bikepacking."},
			    {"url": "/images/roteiros/graciosa.jpg", "descricao": "Serra do Mar vista de Morretes"}
			  ]
			}
			""";

	@Autowired
	private MockMvcTester mvc;

	private MvcTestResult salvar(String corpo) {
		return mvc.put().uri("/api/adm/sobre").contentType(MediaType.APPLICATION_JSON).content(corpo).exchange();
	}

	private MvcTestResult lerNoSite() {
		return mvc.get().uri("/api/sobre").with(anonymous()).exchange();
	}

	@Test
	void semNadaSalvoOSiteRecebe204() {
		assertThat(lerNoSite()).hasStatus(HttpStatus.NO_CONTENT);
		assertThat(mvc.get().uri("/api/adm/sobre").exchange()).hasStatus(HttpStatus.NO_CONTENT);
	}

	@Test
	void oAdmSalvaEOSiteLeAPaginaComMarcosEFotosNaOrdem() {
		assertThat(salvar(PAGINA)).hasStatusOk().bodyJson().extractingPath("$.atualizadoEm").isNotNull();

		var noSite = lerNoSite();
		assertThat(noSite).hasStatusOk().bodyJson().extractingPath("$.titulo").isEqualTo("Entre o código e a estrada");
		// Citação só com espaços vira "sem citação"; legenda ausente continua ausente.
		assertThat(noSite).bodyJson().extractingPath("$.citacao").isNull();
		assertThat(noSite).bodyJson().extractingPath("$.marcos[0].rotulo").isEqualTo("Hoje");
		assertThat(noSite).bodyJson().extractingPath("$.fotos[1].url").isEqualTo("/images/roteiros/graciosa.jpg");
		assertThat(noSite).bodyJson().extractingPath("$.fotos[1].legenda").isNull();
	}

	@Test
	void salvarDeNovoSubstituiOConteudo() {
		salvar(PAGINA);
		var nova = PAGINA.replace("Entre o código e a estrada", "Outro título").replace(
				"""
						{"url": "/images/roteiros/graciosa.jpg", "descricao": "Serra do Mar vista de Morretes"}""", "")
				.replace("\"legenda\": \"Bikepacking.\"},", "\"legenda\": \"Bikepacking.\"}");

		assertThat(salvar(nova)).hasStatusOk();

		assertThat(lerNoSite()).bodyJson().extractingPath("$.titulo").isEqualTo("Outro título");
		assertThat(lerNoSite()).bodyJson().extractingPath("$.fotos.length()").isEqualTo(1);
	}

	@Test
	void recusaCamposObrigatoriosVazios() {
		var resposta = salvar(PAGINA.replace("\"titulo\": \"Entre o código e a estrada\"", "\"titulo\": \"\""));

		assertThat(resposta).hasStatus(HttpStatus.BAD_REQUEST);
		assertThat(resposta).bodyJson().extractingPath("$.campos[*].campo").asArray().contains("titulo");
	}

	@Test
	void recusaFotosDemais() {
		var foto = "{\"url\": \"/images/hero-bikepacking.jpg\", \"descricao\": \"Foto\"}";
		var nove = String.join(",", java.util.Collections.nCopies(9, foto));
		var corpo = PAGINA.substring(0, PAGINA.indexOf("\"fotos\"")) + "\"fotos\": [" + nove + "]}";

		assertThat(salvar(corpo)).hasStatus(HttpStatus.UNPROCESSABLE_CONTENT).bodyJson().extractingPath("$.detail")
				.isEqualTo("A página pode ter até 8 fotos.");
	}

	@Test
	@WithAnonymousUser
	void visitanteNaoEdita() {
		assertThat(salvar(PAGINA)).hasStatus(HttpStatus.UNAUTHORIZED);
	}

}
