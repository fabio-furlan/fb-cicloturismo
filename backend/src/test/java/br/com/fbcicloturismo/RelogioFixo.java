package br.com.fbcicloturismo;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

/**
 * Para o calendário nos testes: "hoje" é sempre {@link #HOJE}, no fuso da aplicação. Testes de fatia
 * ({@code @DataJpaTest}) importam esta classe; os que sobem a aplicação inteira trocam o relógio dela com
 * {@code @TestBean(methodName = "br.com.fbcicloturismo.RelogioFixo#relogio")}.
 */
@TestConfiguration(proxyBeanMethods = false)
public class RelogioFixo {

	public static final LocalDate HOJE = LocalDate.of(2026, 11, 20);

	public static Clock relogio() {
		ZoneId fuso = ZoneId.of("America/Sao_Paulo");
		return Clock.fixed(ZonedDateTime.of(HOJE, LocalTime.of(9, 0), fuso).toInstant(), fuso);
	}

	@Bean
	Clock clock() {
		return relogio();
	}

}
