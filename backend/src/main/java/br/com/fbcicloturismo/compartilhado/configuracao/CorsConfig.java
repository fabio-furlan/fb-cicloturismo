package br.com.fbcicloturismo.compartilhado.configuracao;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Libera o acesso do frontend (Vite em desenvolvimento, Vercel em produção) à API. */
@Configuration
class CorsConfig implements WebMvcConfigurer {

	private final PropriedadesCors propriedades;

	CorsConfig(PropriedadesCors propriedades) {
		this.propriedades = propriedades;
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**")
				.allowedOrigins(propriedades.origensPermitidas().toArray(String[]::new))
				.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE");
	}

}
