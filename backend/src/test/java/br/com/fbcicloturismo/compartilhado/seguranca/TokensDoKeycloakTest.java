package br.com.fbcicloturismo.compartilhado.seguranca;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.fbcicloturismo.TestcontainersConfiguration;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

/**
 * Tokens do Keycloak de ponta a ponta, sem subir o Keycloak: um servidor HTTP publica as chaves públicas no mesmo
 * caminho que o realm usa, e o teste assina os tokens com a chave privada correspondente, como o Keycloak faria.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class TokensDoKeycloakTest {

	private static final String CLIENTE_DO_SITE = "fb-cicloturismo-web";

	private static final RSAKey CHAVE_DO_REALM = gerarChave();

	private static final HttpServer REALM = publicarChaves(CHAVE_DO_REALM);

	private static final String EMISSOR = "http://localhost:" + REALM.getAddress().getPort() + "/realms/teste";

	@DynamicPropertySource
	static void apontarParaORealm(DynamicPropertyRegistry propriedades) {
		propriedades.add("app.keycloak.emissor", () -> EMISSOR);
		propriedades.add("app.keycloak.cliente", () -> CLIENTE_DO_SITE);
	}

	@AfterAll
	static void derrubarRealm() {
		REALM.stop(0);
	}

	@Autowired
	private MockMvcTester mvc;

	@Autowired
	private Clock clock;

	@Test
	void tokenDeAdmAbreAsRotasDoAdm() {
		String token = token(claims -> claims.claim(Papeis.CLAIM, List.of(Papeis.CLIENTE, Papeis.ADM)));

		assertThat(listarSaidasDoAdm(token)).hasStatusOk();
	}

	@Test
	void tokenDeClienteEntraMasNaoAbreAsRotasDoAdm() {
		assertThat(listarSaidasDoAdm(token(claims -> {
		}))).hasStatus(HttpStatus.FORBIDDEN);
	}

	@Test
	void tokenPedidoPorOutroClienteDoRealmERecusado() {
		String token = token(claims -> claims.claim("azp", "account-console")
				.claim(Papeis.CLAIM, List.of(Papeis.ADM)));

		assertThat(listarSaidasDoAdm(token)).hasStatus(HttpStatus.UNAUTHORIZED);
	}

	@Test
	void tokenVencidoERecusado() {
		Instant agora = clock.instant();
		String token = token(claims -> claims.issuedAt(agora.minusSeconds(900)).expiresAt(agora.minusSeconds(600))
				.claim(Papeis.CLAIM, List.of(Papeis.ADM)));

		assertThat(listarSaidasDoAdm(token)).hasStatus(HttpStatus.UNAUTHORIZED);
	}

	@Test
	void tokenAssinadoPorOutraChaveComOMesmoIdERecusado() {
		String token = token(gerarChave(), claims -> claims.claim(Papeis.CLAIM, List.of(Papeis.ADM)));

		assertThat(listarSaidasDoAdm(token)).hasStatus(HttpStatus.UNAUTHORIZED);
	}

	@Test
	void tokenDeEmissorDesconhecidoERecusado() {
		String token = token(claims -> claims.issuer("http://localhost:1/realms/outro")
				.claim(Papeis.CLAIM, List.of(Papeis.ADM)));

		assertThat(listarSaidasDoAdm(token)).hasStatus(HttpStatus.UNAUTHORIZED);
	}

	/** O /api/auth/eu é do login próprio: com um token do Keycloak, responde 401 em vez de quebrar. */
	@Test
	void administradorDoLoginProprioNaoExisteParaTokenDoKeycloak() {
		String token = token(claims -> claims.claim(Papeis.CLAIM, List.of(Papeis.ADM)));

		assertThat(mvc.get().uri("/api/auth/eu").header(HttpHeaders.AUTHORIZATION, "Bearer " + token).exchange())
				.hasStatus(HttpStatus.UNAUTHORIZED);
	}

	private MvcTestResult listarSaidasDoAdm(String token) {
		return mvc.get().uri("/api/adm/saidas").header(HttpHeaders.AUTHORIZATION, "Bearer " + token).exchange();
	}

	private String token(Consumer<JwtClaimsSet.Builder> ajuste) {
		return token(CHAVE_DO_REALM, ajuste);
	}

	/** Um access token como o do Keycloak: válido, do realm de teste, pedido pelo site e só com o papel CLIENTE. */
	private String token(RSAKey chave, Consumer<JwtClaimsSet.Builder> ajuste) {
		Instant agora = clock.instant();
		var claims = JwtClaimsSet.builder()
				.issuer(EMISSOR)
				.subject(UUID.randomUUID().toString())
				.issuedAt(agora)
				.expiresAt(agora.plusSeconds(300))
				.claim("azp", CLIENTE_DO_SITE)
				.claim(Papeis.CLAIM, List.of("default-roles-teste", Papeis.CLIENTE));
		ajuste.accept(claims);
		var cabecalho = JwsHeader.with(SignatureAlgorithm.RS256).keyId(chave.getKeyID()).build();
		var encoder = new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(chave)));
		return encoder.encode(JwtEncoderParameters.from(cabecalho, claims.build())).getTokenValue();
	}

	private static RSAKey gerarChave() {
		try {
			return new RSAKeyGenerator(2048).keyID("chave-do-realm").generate();
		}
		catch (JOSEException e) {
			throw new IllegalStateException(e);
		}
	}

	/** Publica só a parte pública da chave, no endereço em que o Keycloak publica as chaves do realm. */
	private static HttpServer publicarChaves(RSAKey chave) {
		byte[] chaves = new JWKSet(chave.toPublicJWK()).toString().getBytes(StandardCharsets.UTF_8);
		try {
			var servidor = HttpServer.create(new InetSocketAddress("localhost", 0), 0);
			servidor.createContext("/realms/teste/protocol/openid-connect/certs", troca -> {
				troca.getResponseHeaders().add("Content-Type", "application/json");
				troca.sendResponseHeaders(200, chaves.length);
				troca.getResponseBody().write(chaves);
				troca.close();
			});
			servidor.start();
			return servidor;
		}
		catch (IOException e) {
			throw new UncheckedIOException(e);
		}
	}

}
