package br.com.fbcicloturismo.autenticacao;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.fbcicloturismo.TestcontainersConfiguration;
import br.com.fbcicloturismo.autenticacao.dominio.Administrador;
import br.com.fbcicloturismo.autenticacao.infraestrutura.AdministradorRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

/** Login do ADM e proteção das rotas /api/adm com o token emitido, de ponta a ponta. */
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@Transactional
class AutenticacaoApiTest {

	private static final String SENHA = "pedal-forte-2026";

	@Autowired
	private MockMvcTester mvc;

	@Autowired
	private AdministradorRepository administradores;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private Administrador fabio;

	@BeforeEach
	void cadastrarAdministrador() {
		fabio = administradores.save(
				new Administrador("fabio@fbcicloturismo.com.br", "Fabio", passwordEncoder.encode(SENHA)));
	}

	private MvcTestResult entrar(String email, String senha) {
		return mvc.post().uri("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"email": "%s", "senha": "%s"}
						""".formatted(email, senha))
				.exchange();
	}

	private String tokenDe(MvcTestResult login) throws Exception {
		return JsonPath.read(login.getResponse().getContentAsString(), "$.token");
	}

	@Test
	void loginDevolveTokenQueAbreAsRotasDoAdm() throws Exception {
		var login = entrar("fabio@fbcicloturismo.com.br", SENHA);

		assertThat(login).hasStatusOk().bodyJson().extractingPath("$.tipo").isEqualTo("Bearer");
		assertThat(login).bodyJson().extractingPath("$.administrador.nome").isEqualTo("Fabio");
		assertThat(login).bodyJson().extractingPath("$.expiraEm").isNotNull();

		String token = tokenDe(login);
		assertThat(mvc.get().uri("/api/adm/saidas").header(HttpHeaders.AUTHORIZATION, "Bearer " + token).exchange())
				.hasStatusOk();
		assertThat(mvc.get().uri("/api/auth/eu").header(HttpHeaders.AUTHORIZATION, "Bearer " + token).exchange())
				.hasStatusOk().bodyJson().extractingPath("$.email").isEqualTo("fabio@fbcicloturismo.com.br");
	}

	@Test
	void emailNaoDiferenciaMaiusculasNemEspacos() {
		assertThat(entrar("  Fabio@FBCicloturismo.com.br ", SENHA)).hasStatusOk();
	}

	@Test
	void senhaErradaEEmailInexistenteRespondemOMesmo401() {
		for (var tentativa : new MvcTestResult[] { entrar("fabio@fbcicloturismo.com.br", "senha-errada"),
				entrar("ninguem@fbcicloturismo.com.br", SENHA) }) {
			assertThat(tentativa).hasStatus(HttpStatus.UNAUTHORIZED)
					.hasContentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON);
			assertThat(tentativa).bodyJson().extractingPath("$.detail").isEqualTo("E-mail ou senha inválidos.");
		}
	}

	@Test
	void contaDesativadaNaoEntra() {
		fabio.desativar();
		administradores.flush();

		assertThat(entrar("fabio@fbcicloturismo.com.br", SENHA)).hasStatus(HttpStatus.UNAUTHORIZED);
	}

	@Test
	void rotasDoAdmExigemTokenValido() {
		assertThat(mvc.get().uri("/api/adm/saidas").exchange()).hasStatus(HttpStatus.UNAUTHORIZED);
		assertThat(mvc.get().uri("/api/adm/saidas").header(HttpHeaders.AUTHORIZATION, "Bearer nao-e-um-jwt").exchange())
				.hasStatus(HttpStatus.UNAUTHORIZED);
	}

	@Test
	void documentacaoESaudeSaoPublicas() {
		assertThat(mvc.get().uri("/v3/api-docs").exchange()).hasStatusOk();
		assertThat(mvc.get().uri("/actuator/health").exchange()).hasStatusOk();
	}

}
