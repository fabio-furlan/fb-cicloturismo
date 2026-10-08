package br.com.fbcicloturismo.compartilhado.seguranca;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * Assinatura dos tokens do ADM.
 *
 * @param segredo  chave HMAC com pelo menos 32 caracteres (variável APP_JWT_SEGREDO). Em branco, a aplicação gera uma
 *                 chave aleatória a cada início: serve para desenvolvimento, mas desloga todo mundo a cada reinício.
 * @param validade por quanto tempo o token vale depois do login
 */
@ConfigurationProperties("app.jwt")
public record PropriedadesJwt(String segredo, @DefaultValue("8h") Duration validade) {
}
