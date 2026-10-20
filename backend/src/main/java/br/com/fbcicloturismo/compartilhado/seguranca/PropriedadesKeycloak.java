package br.com.fbcicloturismo.compartilhado.seguranca;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * Tokens emitidos pelo Keycloak, aceitos ao lado dos tokens próprios da API enquanto o login migra para ele.
 *
 * @param emissor endereço do realm, igual ao claim {@code iss} dos tokens (variável APP_KEYCLOAK_EMISSOR), por exemplo
 *                {@code http://localhost:8180/realms/fb-cicloturismo}. Em branco, a API só aceita os tokens próprios.
 * @param cliente o cliente do realm que pediu o token (claim {@code azp}). Tokens pedidos por outro cliente do mesmo
 *                realm, como o console de conta do Keycloak, não abrem a API.
 */
@ConfigurationProperties("app.keycloak")
public record PropriedadesKeycloak(String emissor, @DefaultValue("fb-cicloturismo-web") String cliente) {

	public boolean ativo() {
		return emissor != null && !emissor.isBlank();
	}

	/** Onde o realm publica as chaves públicas que conferem a assinatura dos tokens. */
	String enderecoDasChaves() {
		return emissor + "/protocol/openid-connect/certs";
	}

}
