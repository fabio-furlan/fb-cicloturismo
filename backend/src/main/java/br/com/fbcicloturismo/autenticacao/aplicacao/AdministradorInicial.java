package br.com.fbcicloturismo.autenticacao.aplicacao;

import br.com.fbcicloturismo.autenticacao.dominio.Administrador;
import br.com.fbcicloturismo.autenticacao.infraestrutura.AdministradorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Cria o primeiro administrador a partir de APP_ADMIN_EMAIL e APP_ADMIN_SENHA, só enquanto não houver nenhum. Depois
 * disso as variáveis são ignoradas: trocar a senha nelas não altera uma conta que já existe.
 */
@Component
@EnableConfigurationProperties(AdministradorInicial.Propriedades.class)
class AdministradorInicial implements ApplicationRunner {

	static final int TAMANHO_MINIMO_SENHA = 12;

	private static final Logger log = LoggerFactory.getLogger(AdministradorInicial.class);

	@ConfigurationProperties("app.admin-inicial")
	record Propriedades(String email, @DefaultValue("Administrador") String nome, String senha) {

		boolean definido() {
			return email != null && !email.isBlank() && senha != null && !senha.isBlank();
		}

	}

	private final Propriedades propriedades;

	private final AdministradorRepository administradores;

	private final PasswordEncoder passwordEncoder;

	AdministradorInicial(Propriedades propriedades, AdministradorRepository administradores,
			PasswordEncoder passwordEncoder) {
		this.propriedades = propriedades;
		this.administradores = administradores;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		criarSeNecessario();
	}

	void criarSeNecessario() {
		if (administradores.count() > 0) {
			return;
		}
		if (!propriedades.definido()) {
			log.warn("Nenhum administrador cadastrado. Defina APP_ADMIN_EMAIL e APP_ADMIN_SENHA para criar o primeiro.");
			return;
		}
		if (propriedades.senha().length() < TAMANHO_MINIMO_SENHA) {
			throw new IllegalStateException(
					"APP_ADMIN_SENHA precisa ter pelo menos %d caracteres.".formatted(TAMANHO_MINIMO_SENHA));
		}
		var administrador = new Administrador(propriedades.email(), propriedades.nome(),
				passwordEncoder.encode(propriedades.senha()));
		administradores.save(administrador);
		log.info("Administrador inicial {} criado.", administrador.getEmail());
	}

}
