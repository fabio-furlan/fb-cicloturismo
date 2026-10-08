package br.com.fbcicloturismo.compartilhado.configuracao;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Libera o acesso do frontend (Vite em desenvolvimento, Vercel em produção) à API. */
@Configuration
class CorsConfig implements WebMvcConfigurer {

	private final String[] origensPermitidas;

	CorsConfig(@Value("${app.cors.origens-permitidas}") String[] origensPermitidas) {
		this.origensPermitidas = origensPermitidas;
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**")
				.allowedOrigins(origensPermitidas)
				.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE");
	}

}
