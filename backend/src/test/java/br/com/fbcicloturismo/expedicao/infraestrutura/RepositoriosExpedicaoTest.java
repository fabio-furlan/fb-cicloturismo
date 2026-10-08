package br.com.fbcicloturismo.expedicao.infraestrutura;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import br.com.fbcicloturismo.TestcontainersConfiguration;
import br.com.fbcicloturismo.expedicao.dominio.Etapa;
import br.com.fbcicloturismo.expedicao.dominio.Exemplos;
import br.com.fbcicloturismo.expedicao.dominio.GrupoOpcional;
import br.com.fbcicloturismo.expedicao.dominio.Opcional;
import br.com.fbcicloturismo.expedicao.dominio.PeriodoSaida;
import br.com.fbcicloturismo.expedicao.dominio.Roteiro;
import br.com.fbcicloturismo.expedicao.dominio.Saida;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

/**
 * Grava e lê roteiros e saídas num PostgreSQL real (Testcontainers), com o esquema criado pelas migrations do Flyway.
 * Garante que o mapeamento JPA e as migrations continuam de acordo.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestcontainersConfiguration.class)
class RepositoriosExpedicaoTest {

	@Autowired
	private RoteiroRepository roteiros;

	@Autowired
	private SaidaRepository saidas;

	@Autowired
	private EntityManager entityManager;

	@Test
	void gravaELeRoteiroComEtapasImagensEPerfil() {
		roteiros.save(Exemplos.roteiroAparecida());
		entityManager.flush();
		entityManager.clear();

		Roteiro lido = roteiros.findBySlug("aparecida").orElseThrow();

		assertThat(lido.getTitulo()).isEqualTo("Aparecida do Norte");
		assertThat(lido.getDistanciaKm()).isEqualByComparingTo("198");
		assertThat(lido.getAltitudes()).containsExactly(792, 750, 730, 560);
		assertThat(lido.getEtapas()).extracting(Etapa::dia).containsExactly(1, 2, 3);
		assertThat(lido.getImagens()).singleElement()
				.satisfies(imagem -> assertThat(imagem.autor()).isEqualTo("Damáris Gonçalves"));
		assertThat(lido.getCriadoEm()).isNotNull();
	}

	@Test
	void gravaSaidaComOpcionaisEListaParaODashboard() {
		Roteiro roteiro = roteiros.save(Exemplos.roteiroAparecida());
		Saida dezembro = Exemplos.saidaDezembro(roteiro);
		dezembro.adicionarOpcional(GrupoOpcional.ACOMODACAO, "Quarto individual", null, new BigDecimal("380.00"));
		dezembro.publicar();
		saidas.save(dezembro);
		saidas.save(dezembro.duplicarPara(
				new PeriodoSaida(LocalDate.of(2027, 10, 9), LocalDate.of(2027, 10, 11), LocalDate.of(2027, 9, 25))));
		entityManager.flush();
		entityManager.clear();

		var lista = saidas.findComRoteiroTerminandoAPartirDe(LocalDate.of(2026, 12, 14));

		assertThat(lista).extracting(Saida::getDataInicio)
				.containsExactly(LocalDate.of(2026, 12, 12), LocalDate.of(2027, 10, 9));
		assertThat(lista).allSatisfy(saida -> {
			assertThat(saida.getRoteiro().getSlug()).isEqualTo("aparecida");
			assertThat(saida.getOpcionais()).extracting(Opcional::getGrupo, Opcional::getNome)
					.containsExactly(tuple(GrupoOpcional.ACOMODACAO, "Quarto individual"));
		});
		assertThat(saidas.findComRoteiroTerminandoAPartirDe(LocalDate.of(2026, 12, 15))).hasSize(1);
	}

}
