package br.com.fbcicloturismo.expedicao.infraestrutura;

import br.com.fbcicloturismo.expedicao.dominio.Saida;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SaidaRepository extends JpaRepository<Saida, Long> {

	/** Saídas que terminam a partir de {@code data}, com o roteiro já carregado, para o dashboard do ADM. */
	@Query("""
			select s from Saida s join fetch s.roteiro
			where s.dataFim >= :data
			order by s.dataInicio, s.id
			""")
	List<Saida> findComRoteiroTerminandoAPartirDe(LocalDate data);

	List<Saida> findByRoteiroIdOrderByDataInicio(Long roteiroId);

	boolean existsByRoteiroId(Long roteiroId);

}
