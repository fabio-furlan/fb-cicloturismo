package br.com.fbcicloturismo.expedicao.infraestrutura;

import br.com.fbcicloturismo.compartilhado.dominio.RecursoNaoEncontradoException;
import br.com.fbcicloturismo.expedicao.dominio.Roteiro;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoteiroRepository extends JpaRepository<Roteiro, Long> {

	/** O roteiro com este id, ou 404. */
	default Roteiro carregar(long id) {
		return findById(id).orElseThrow(() -> naoEncontrado(id));
	}

	/** Para quando basta saber que o roteiro existe, sem carregá-lo. */
	default void garantirQueExiste(long id) {
		if (!existsById(id)) {
			throw naoEncontrado(id);
		}
	}

	Optional<Roteiro> findBySlug(String slug);

	boolean existsBySlug(String slug);

	private static RecursoNaoEncontradoException naoEncontrado(long id) {
		return new RecursoNaoEncontradoException("Roteiro %d não encontrado.".formatted(id));
	}

}
