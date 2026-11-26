package br.com.fbcicloturismo.institucional.api;

import br.com.fbcicloturismo.institucional.aplicacao.ConteudoInstitucional;
import br.com.fbcicloturismo.institucional.aplicacao.PaginaSobreVisao;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ADM: sobre nós", description = "Edição da página Sobre nós do site")
@RestController
@RequestMapping("/api/adm/sobre")
class SobreAdmController {

	private final ConteudoInstitucional conteudo;

	SobreAdmController(ConteudoInstitucional conteudo) {
		this.conteudo = conteudo;
	}

	@Operation(summary = "A página Sobre nós salva", description = "204 enquanto ninguém a salvou.")
	@GetMapping
	ResponseEntity<PaginaSobreVisao> buscar() {
		return conteudo.sobre().map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
	}

	@Operation(summary = "Salva a página Sobre nós", description = "Cria no primeiro salvamento e substitui nos seguintes.")
	@PutMapping
	PaginaSobreVisao salvar(@Valid @RequestBody PaginaSobreRequest corpo) {
		return conteudo.salvarSobre(corpo.paraDados());
	}

}
