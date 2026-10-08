package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.compartilhado.dominio.RecursoNaoEncontradoException;
import br.com.fbcicloturismo.compartilhado.dominio.RegraDeNegocioException;
import br.com.fbcicloturismo.expedicao.dominio.DadosRoteiro;
import br.com.fbcicloturismo.expedicao.dominio.Roteiro;
import br.com.fbcicloturismo.expedicao.infraestrutura.RoteiroRepository;
import br.com.fbcicloturismo.expedicao.infraestrutura.SaidaRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Cadastro de roteiros pelo ADM. */
@Service
@Transactional
public class GestaoDeRoteiros {

	private final RoteiroRepository roteiros;

	private final SaidaRepository saidas;

	GestaoDeRoteiros(RoteiroRepository roteiros, SaidaRepository saidas) {
		this.roteiros = roteiros;
		this.saidas = saidas;
	}

	/** Cria o roteiro com um slug tirado do título. Se já existir, acrescenta um número: "aparecida-2". */
	public RoteiroVisao criar(DadosRoteiro dados) {
		var roteiro = roteiros.save(new Roteiro(slugLivre(dados.titulo()), dados));
		return RoteiroVisao.de(roteiro);
	}

	/** Altera os dados do roteiro. O slug não muda, para não quebrar links já divulgados. */
	public RoteiroVisao atualizar(long id, DadosRoteiro dados) {
		var roteiro = carregar(id);
		roteiro.atualizar(dados);
		return RoteiroVisao.de(roteiro);
	}

	@Transactional(readOnly = true)
	public RoteiroVisao buscar(long id) {
		return RoteiroVisao.de(carregar(id));
	}

	@Transactional(readOnly = true)
	public List<RoteiroVisao> listar() {
		return roteiros.findAll(Sort.by("titulo")).stream().map(RoteiroVisao::de).toList();
	}

	/** Só exclui roteiros sem saídas; os demais têm histórico de vendas e devem ter as saídas canceladas. */
	public void excluir(long id) {
		var roteiro = carregar(id);
		if (saidas.existsByRoteiroId(id)) {
			throw new RegraDeNegocioException("O roteiro tem saídas cadastradas e não pode ser excluído.");
		}
		roteiros.delete(roteiro);
	}

	private Roteiro carregar(long id) {
		return roteiros.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Roteiro %d não encontrado.".formatted(id)));
	}

	private String slugLivre(String titulo) {
		String base = Slugs.de(titulo);
		String slug = base;
		for (int sufixo = 2; roteiros.existsBySlug(slug); sufixo++) {
			slug = base + "-" + sufixo;
		}
		return slug;
	}

}
