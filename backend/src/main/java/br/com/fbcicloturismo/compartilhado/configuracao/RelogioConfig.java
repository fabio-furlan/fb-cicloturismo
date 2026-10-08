package br.com.fbcicloturismo.compartilhado.configuracao;

import java.time.Clock;
import java.time.ZoneId;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Relógio da aplicação, no fuso de Brasília: "hoje" decide o status das saídas. Os casos de uso recebem o
 * {@link Clock} em vez de chamar {@code LocalDate.now()}, para os testes fixarem a data.
 */
@Configuration
class RelogioConfig {

	@Bean
	Clock clock() {
		return Clock.system(ZoneId.of("America/Sao_Paulo"));
	}

}
