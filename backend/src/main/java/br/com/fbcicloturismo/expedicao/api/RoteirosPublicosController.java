package br.com.fbcicloturismo.expedicao.api;

import br.com.fbcicloturismo.expedicao.aplicacao.CatalogoPublico;
import br.com.fbcicloturismo.expedicao.aplicacao.RoteiroPublico;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Catálogo do site, aberto a qualquer visitante. */
@Tag(name = "Site: roteiros", description = "Roteiros e saídas à venda, sem autenticação")
@SecurityRequirements
@RestController
@RequestMapping("/api/roteiros")
class RoteirosPublicosController {

	private final CatalogoPublico catalogo;

	RoteirosPublicosController(CatalogoPublico catalogo) {
		this.catalogo = catalogo;
	}

	@Operation(summary = "Roteiros com saídas à venda, pela saída mais próxima")
	@GetMapping
	List<RoteiroPublico> roteiros() {
		return catalogo.roteiros();
	}

	@Operation(summary = "Um roteiro pelo slug, com as saídas à venda")
	@GetMapping("/{slug}")
	RoteiroPublico roteiro(@PathVariable String slug) {
		return catalogo.roteiro(slug);
	}

}
