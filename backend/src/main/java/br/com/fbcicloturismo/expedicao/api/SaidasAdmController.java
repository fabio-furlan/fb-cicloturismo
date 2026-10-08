package br.com.fbcicloturismo.expedicao.api;

import br.com.fbcicloturismo.expedicao.aplicacao.GestaoDeSaidas;
import br.com.fbcicloturismo.expedicao.aplicacao.PainelDeSaidas;
import br.com.fbcicloturismo.expedicao.aplicacao.ResumoSaida;
import br.com.fbcicloturismo.expedicao.aplicacao.SaidaVisao;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Saídas e seus opcionais. Publicar, cancelar e duplicar são ações sobre a saída, então viram POST em sub-recursos
 * em vez de um PATCH na situação: cada uma tem regras próprias e o domínio decide se a transição é permitida.
 */
@Tag(name = "ADM: saídas", description = "Dashboard, edição, publicação e opcionais das saídas")
@RestController
@RequestMapping("/api/adm/saidas")
class SaidasAdmController {

	private final GestaoDeSaidas gestaoDeSaidas;

	private final PainelDeSaidas painel;

	SaidasAdmController(GestaoDeSaidas gestaoDeSaidas, PainelDeSaidas painel) {
		this.gestaoDeSaidas = gestaoDeSaidas;
		this.painel = painel;
	}

	@Operation(summary = "Dashboard: saídas que ainda não terminaram, com status e vagas vendidas")
	@GetMapping
	List<ResumoSaida> proximas() {
		return painel.proximas();
	}

	@GetMapping("/{id}")
	SaidaVisao buscar(@PathVariable long id) {
		return gestaoDeSaidas.buscar(id);
	}

	@PutMapping("/{id}")
	SaidaVisao alterar(@PathVariable long id, @Valid @RequestBody SaidaRequest corpo) {
		return gestaoDeSaidas.alterar(id, corpo.paraDados());
	}

	@Operation(summary = "Exclui uma saída em rascunho")
	@DeleteMapping("/{id}")
	ResponseEntity<Void> excluir(@PathVariable long id) {
		gestaoDeSaidas.excluir(id);
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "Publica a saída, abrindo as inscrições")
	@PostMapping("/{id}/publicar")
	SaidaVisao publicar(@PathVariable long id) {
		return gestaoDeSaidas.publicar(id);
	}

	@PostMapping("/{id}/cancelar")
	SaidaVisao cancelar(@PathVariable long id) {
		return gestaoDeSaidas.cancelar(id);
	}

	@Operation(summary = "Copia a saída, com preço e opcionais, para novas datas")
	@PostMapping("/{id}/duplicar")
	ResponseEntity<SaidaVisao> duplicar(@PathVariable long id, @Valid @RequestBody PeriodoRequest corpo) {
		var copia = gestaoDeSaidas.duplicar(id, corpo.paraPeriodo());
		return ResponseEntity.created(URI.create("/api/adm/saidas/" + copia.id())).body(copia);
	}

	@PostMapping("/{id}/opcionais")
	SaidaVisao adicionarOpcional(@PathVariable long id, @Valid @RequestBody OpcionalRequest corpo) {
		return gestaoDeSaidas.adicionarOpcional(id, corpo.paraNovoOpcional());
	}

	@DeleteMapping("/{id}/opcionais/{opcionalId}")
	SaidaVisao removerOpcional(@PathVariable long id, @PathVariable long opcionalId) {
		return gestaoDeSaidas.removerOpcional(id, opcionalId);
	}

}
