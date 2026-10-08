package br.com.fbcicloturismo.expedicao.infraestrutura;

import br.com.fbcicloturismo.expedicao.dominio.Roteiro;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoteiroRepository extends JpaRepository<Roteiro, Long> {

	Optional<Roteiro> findBySlug(String slug);

	boolean existsBySlug(String slug);

}
