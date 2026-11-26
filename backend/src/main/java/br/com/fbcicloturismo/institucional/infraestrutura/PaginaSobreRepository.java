package br.com.fbcicloturismo.institucional.infraestrutura;

import br.com.fbcicloturismo.institucional.dominio.PaginaSobre;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaginaSobreRepository extends JpaRepository<PaginaSobre, Long> {

	/** A página, se o ADM já a salvou alguma vez. */
	default Optional<PaginaSobre> pagina() {
		return findById(PaginaSobre.ID);
	}

}
