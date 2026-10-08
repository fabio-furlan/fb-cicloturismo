package br.com.fbcicloturismo.compartilhado.configuracao;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Metadados da documentação da API, servida em /docs. */
@Configuration
class OpenApiConfig {

	@Bean
	OpenAPI openApi() {
		return new OpenAPI().info(new Info()
				.title("FB Cicloturismo API")
				.description("Roteiros, saídas e inscrições das viagens de bicicleta da FB Cicloturismo.")
				.version("v1"));
	}

}
