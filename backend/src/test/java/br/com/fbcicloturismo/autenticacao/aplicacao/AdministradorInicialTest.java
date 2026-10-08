package br.com.fbcicloturismo.autenticacao.aplicacao;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.fbcicloturismo.TestcontainersConfiguration;
import br.com.fbcicloturismo.autenticacao.dominio.Administrador;
import br.com.fbcicloturismo.autenticacao.infraestrutura.AdministradorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestcontainersConfiguration.class)
class AdministradorInicialTest {

	private final PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

	@Autowired
	private AdministradorRepository administradores;

	private AdministradorInicial com(String email, String senha) {
		return new AdministradorInicial(new AdministradorInicial.Propriedades(email, "Fabio", senha), administradores,
				passwordEncoder);
	}

	@Test
	void criaOPrimeiroComSenhaEmHash() {
		com("Fabio@FBCicloturismo.com.br", "pedal-forte-2026").criarSeNecessario();

		Administrador criado = administradores.findByEmail("fabio@fbcicloturismo.com.br").orElseThrow();
		assertThat(criado.getSenhaHash()).startsWith("{bcrypt}").doesNotContain("pedal-forte-2026");
		assertThat(passwordEncoder.matches("pedal-forte-2026", criado.getSenhaHash())).isTrue();
	}

	@Test
	void naoMexeQuandoJaExisteAdministrador() {
		com("fabio@fbcicloturismo.com.br", "pedal-forte-2026").criarSeNecessario();

		com("outro@fbcicloturismo.com.br", "outra-senha-longa").criarSeNecessario();

		assertThat(administradores.count()).isEqualTo(1);
	}

	@Test
	void semVariaveisNaoCriaNada() {
		com(null, null).criarSeNecessario();

		assertThat(administradores.count()).isZero();
	}

	@Test
	void recusaSenhaCurta() {
		assertThatThrownBy(() -> com("fabio@fbcicloturismo.com.br", "curta").criarSeNecessario())
				.isInstanceOf(IllegalStateException.class);
	}

}
