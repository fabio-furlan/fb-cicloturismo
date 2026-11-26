package br.com.fbcicloturismo.institucional.aplicacao;

import br.com.fbcicloturismo.institucional.dominio.DadosPaginaSobre;
import br.com.fbcicloturismo.institucional.dominio.PaginaSobre;
import br.com.fbcicloturismo.institucional.infraestrutura.PaginaSobreRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Leitura da página "Sobre nós" pelo site e edição pelo ADM. */
@Service
@Transactional
public class ConteudoInstitucional {

	private final PaginaSobreRepository paginas;

	ConteudoInstitucional(PaginaSobreRepository paginas) {
		this.paginas = paginas;
	}

	/** A página salva pelo ADM. Vazio enquanto ninguém a salvou: o site mostra o texto padrão dele. */
	@Transactional(readOnly = true)
	public Optional<PaginaSobreVisao> sobre() {
		return paginas.pagina().map(PaginaSobreVisao::de);
	}

	/** Cria a página no primeiro salvamento e a altera nos seguintes. */
	public PaginaSobreVisao salvarSobre(DadosPaginaSobre dados) {
		var pagina = paginas.pagina().map(existente -> {
			existente.atualizar(dados);
			return existente;
		}).orElseGet(() -> new PaginaSobre(dados));
		// saveAndFlush grava agora, para a data de atualização já voltar preenchida na resposta.
		return PaginaSobreVisao.de(paginas.saveAndFlush(pagina));
	}

}
