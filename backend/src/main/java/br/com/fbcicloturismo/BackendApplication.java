package br.com.fbcicloturismo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/** As propriedades {@code app.*} são records com {@code @ConfigurationProperties}, registrados pela varredura. */
@SpringBootApplication
@ConfigurationPropertiesScan
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
