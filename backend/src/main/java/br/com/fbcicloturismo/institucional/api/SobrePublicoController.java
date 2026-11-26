package br.com.fbcicloturismo.institucional.api;

import br.com.fbcicloturismo.institucional.aplicacao.ConteudoInstitucional;
import br.com.fbcicloturismo.institucional.aplicacao.PaginaSobreVisao;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** A página "Sobre nós" para qualquer visitante. */
@Tag(name = "Site: sobre nós", description = "Conteúdo da página Sobre nós, sem autenticação")
@SecurityRequirements
@RestController
@RequestMapping("/api/sobre")
class SobrePublicoController {

	private final ConteudoInstitucional conteudo;

	SobrePublicoController(ConteudoInstitucional conteudo) {
		this.conteudo = conteudo;
	}

	@Operation(summary = "A página Sobre nós", description = "204 enquanto o ADM não a salvou: o site mostra o texto padrão.")
	@GetMapping
	ResponseEntity<PaginaSobreVisao> sobre() {
		return conteudo.sobre().map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
	}

}
