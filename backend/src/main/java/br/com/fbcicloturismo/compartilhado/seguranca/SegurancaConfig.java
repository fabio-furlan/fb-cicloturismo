package br.com.fbcicloturismo.compartilhado.seguranca;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Clock;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtIssuerValidator;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtIssuerAuthenticationManagerResolver;
import org.springframework.security.web.SecurityFilterChain;

/**
 * A API é stateless: o ADM faz login em /api/auth/login, recebe um JWT assinado com HMAC-SHA256 e o envia no cabeçalho
 * {@code Authorization: Bearer}. Sem sessão nem cookie, não há CSRF a proteger, e o front na Vercel conversa com a API
 * no Render sem depender de cookies entre domínios.
 * <p>
 * Com {@code app.keycloak.emissor} configurado, a API aceita também os tokens do Keycloak. O claim {@code iss} decide
 * quem confere cada token: os próprios, com o segredo HMAC; os do Keycloak, com as chaves públicas do realm. Um token
 * de qualquer outro emissor é recusado.
 */
@Configuration
class SegurancaConfig {

	private static final Logger log = LoggerFactory.getLogger(SegurancaConfig.class);

	@Bean
	SecurityFilterChain filtrosDeSeguranca(HttpSecurity http, JwtIssuerAuthenticationManagerResolver emissores)
			throws Exception {
		return http
				.csrf(csrf -> csrf.disable())
				.cors(Customizer.withDefaults())
				.sessionManagement(sessao -> sessao.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.httpBasic(basic -> basic.disable())
				.formLogin(form -> form.disable())
				.authorizeHttpRequests(regras -> regras
						.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/roteiros", "/api/roteiros/**").permitAll()
						.requestMatchers("/api/adm/**").hasRole(Papeis.ADM)
						.requestMatchers("/docs", "/docs/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
						.requestMatchers("/actuator/health", "/actuator/health/**", "/error").permitAll()
						.anyRequest().authenticated())
				.oauth2ResourceServer(servidor -> servidor.authenticationManagerResolver(emissores))
				.build();
	}

	@Bean
	JwtIssuerAuthenticationManagerResolver emissores(JwtDecoder jwtDecoder, ContasAtivas contas,
			PropriedadesKeycloak keycloak, Clock clock) {
		Map<String, AuthenticationManager> porEmissor = new HashMap<>();
		porEmissor.put(PropriedadesJwt.EMISSOR, autenticador(jwtDecoder, conversorDeToken(contas)));
		if (keycloak.ativo()) {
			porEmissor.put(keycloak.emissor(), autenticador(decodificadorKeycloak(keycloak, clock), conversorDePapeis()));
		}
		return new JwtIssuerAuthenticationManagerResolver(porEmissor::get);
	}

	private static AuthenticationManager autenticador(JwtDecoder decoder,
			Converter<Jwt, ? extends AbstractAuthenticationToken> conversor) {
		var provedor = new JwtAuthenticationProvider(decoder);
		provedor.setJwtAuthenticationConverter(conversor);
		return provedor::authenticate;
	}

	/**
	 * Confere os tokens do Keycloak com as chaves públicas do realm (RS256), buscadas no primeiro uso e guardadas em
	 * cache: a API sobe mesmo com o Keycloak fora do ar. Além de assinatura e validade, exige o emissor e o cliente
	 * certos. Não há checagem de conta ativa: quem desativa um usuário é o Keycloak, e o token dele vale só 5 minutos.
	 */
	private static JwtDecoder decodificadorKeycloak(PropriedadesKeycloak keycloak, Clock clock) {
		var decoder = NimbusJwtDecoder.withJwkSetUri(keycloak.enderecoDasChaves()).build();
		var validadeNoTempo = new JwtTimestampValidator();
		validadeNoTempo.setClock(clock);
		decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(validadeNoTempo,
				new JwtIssuerValidator(keycloak.emissor()),
				new JwtClaimValidator<String>("azp", keycloak.cliente()::equals)));
		return decoder;
	}

	/**
	 * Transforma o token validado em autenticação, mas só se a conta dona dele ainda existir e estiver ativa. Sem isso,
	 * um token vazado ou de uma conta apagada valeria até expirar. Responde 401 como qualquer token inválido.
	 */
	private static Converter<Jwt, AbstractAuthenticationToken> conversorDeToken(ContasAtivas contas) {
		var papeis = conversorDePapeis();
		return token -> {
			if (!contas.estaAtiva(token.getSubject())) {
				throw new InvalidBearerTokenException("A conta deste token foi removida ou desativada.");
			}
			return papeis.convert(token);
		};
	}

	private static JwtAuthenticationConverter conversorDePapeis() {
		var autoridades = new JwtGrantedAuthoritiesConverter();
		autoridades.setAuthoritiesClaimName(Papeis.CLAIM);
		autoridades.setAuthorityPrefix("ROLE_");
		var conversor = new JwtAuthenticationConverter();
		conversor.setJwtGrantedAuthoritiesConverter(autoridades);
		return conversor;
	}

	@Bean
	SecretKey chaveJwt(PropriedadesJwt propriedades) {
		byte[] bytes;
		if (propriedades.segredo() == null || propriedades.segredo().isBlank()) {
			log.warn("APP_JWT_SEGREDO não definido: usando uma chave aleatória. Os tokens deixam de valer a cada reinício.");
			bytes = new byte[32];
			new SecureRandom().nextBytes(bytes);
		}
		else {
			bytes = propriedades.segredo().getBytes(StandardCharsets.UTF_8);
			if (bytes.length < 32) {
				throw new IllegalStateException("APP_JWT_SEGREDO precisa ter pelo menos 32 caracteres para o HS256.");
			}
		}
		return new SecretKeySpec(bytes, "HmacSHA256");
	}

	@Bean
	JwtEncoder jwtEncoder(SecretKey chaveJwt) {
		return new NimbusJwtEncoder(new ImmutableSecret<>(chaveJwt));
	}

	/** Confere assinatura e validade usando o relógio da aplicação, o mesmo que carimba a emissão. */
	@Bean
	JwtDecoder jwtDecoder(SecretKey chaveJwt, Clock clock) {
		var decoder = NimbusJwtDecoder.withSecretKey(chaveJwt).macAlgorithm(MacAlgorithm.HS256).build();
		var validadeNoTempo = new JwtTimestampValidator();
		validadeNoTempo.setClock(clock);
		decoder.setJwtValidator(validadeNoTempo);
		return decoder;
	}

	/** Gera hashes BCrypt com o prefixo {bcrypt}, o que permite trocar de algoritmo no futuro sem migrar senhas. */
	@Bean
	PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

}
