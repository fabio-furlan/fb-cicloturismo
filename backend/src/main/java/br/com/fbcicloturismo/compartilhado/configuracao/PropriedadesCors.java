package br.com.fbcicloturismo.compartilhado.configuracao;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Quem pode chamar a API pelo navegador.
 *
 * @param origensPermitidas endereços do frontend, separados por vírgula na variável APP_CORS_ORIGENS
 */
@ConfigurationProperties("app.cors")
record PropriedadesCors(List<String> origensPermitidas) {
}
