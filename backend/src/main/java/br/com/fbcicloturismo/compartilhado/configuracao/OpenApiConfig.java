package br.com.fbcicloturismo.compartilhado.configuracao;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Metadados da documentação da API, servida em /docs. O esquema Bearer habilita o botão "Authorize" do Swagger: cole o
 * token devolvido por POST /api/auth/login para chamar os endpoints do ADM.
 */
@Configuration
class OpenApiConfig {

	@Bean
	OpenAPI openApi() {
		return new OpenAPI().info(new Info()
				.title("FB Cicloturismo API")
				.description("Roteiros, saídas e inscrições das viagens de bicicleta da FB Cicloturismo.")
				.version("v1"))
				.components(new Components().addSecuritySchemes("token",
						new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")))
				.addSecurityItem(new SecurityRequirement().addList("token"));
	}

}
