package br.com.fbcicloturismo.autenticacao.infraestrutura;

import br.com.fbcicloturismo.autenticacao.dominio.Administrador;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {

	/** Recebe o e-mail já normalizado ({@link Administrador#normalizarEmail(String)}). */
	Optional<Administrador> findByEmail(String email);

}
