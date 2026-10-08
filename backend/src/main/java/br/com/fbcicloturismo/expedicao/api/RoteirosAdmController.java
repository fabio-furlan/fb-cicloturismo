package br.com.fbcicloturismo.expedicao.api;

import br.com.fbcicloturismo.expedicao.aplicacao.GestaoDeRoteiros;
import br.com.fbcicloturismo.expedicao.aplicacao.GestaoDeSaidas;
import br.com.fbcicloturismo.expedicao.aplicacao.PainelDeSaidas;
import br.com.fbcicloturismo.expedicao.aplicacao.ResumoSaida;
import br.com.fbcicloturismo.expedicao.aplicacao.RoteiroVisao;
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

@Tag(name = "ADM: roteiros", description = "Cadastro dos roteiros e criação das suas saídas")
@RestController
@RequestMapping("/api/adm/roteiros")
class RoteirosAdmController {

	private final GestaoDeRoteiros gestaoDeRoteiros;

	private final GestaoDeSaidas gestaoDeSaidas;

	private final PainelDeSaidas painel;

	RoteirosAdmController(GestaoDeRoteiros gestaoDeRoteiros, GestaoDeSaidas gestaoDeSaidas, PainelDeSaidas painel) {
		this.gestaoDeRoteiros = gestaoDeRoteiros;
		this.gestaoDeSaidas = gestaoDeSaidas;
		this.painel = painel;
	}

	@Operation(summary = "Lista os roteiros em ordem alfabética")
	@GetMapping
	List<RoteiroVisao> listar() {
		return gestaoDeRoteiros.listar();
	}

	@GetMapping("/{id}")
	RoteiroVisao buscar(@PathVariable long id) {
		return gestaoDeRoteiros.buscar(id);
	}

	@Operation(summary = "Cria um roteiro", description = "O slug é gerado a partir do título e não muda depois.")
	@PostMapping
	ResponseEntity<RoteiroVisao> criar(@Valid @RequestBody RoteiroRequest corpo) {
		var criado = gestaoDeRoteiros.criar(corpo.paraDados());
		return ResponseEntity.created(URI.create("/api/adm/roteiros/" + criado.id())).body(criado);
	}

	@PutMapping("/{id}")
	RoteiroVisao atualizar(@PathVariable long id, @Valid @RequestBody RoteiroRequest corpo) {
		return gestaoDeRoteiros.atualizar(id, corpo.paraDados());
	}

	@Operation(summary = "Exclui um roteiro sem saídas")
	@DeleteMapping("/{id}")
	ResponseEntity<Void> excluir(@PathVariable long id) {
		gestaoDeRoteiros.excluir(id);
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "Lista todas as saídas do roteiro, inclusive as finalizadas")
	@GetMapping("/{id}/saidas")
	List<ResumoSaida> saidas(@PathVariable long id) {
		return painel.doRoteiro(id);
	}

	@Operation(summary = "Cria uma saída do roteiro, como rascunho")
	@PostMapping("/{id}/saidas")
	ResponseEntity<SaidaVisao> criarSaida(@PathVariable long id, @Valid @RequestBody SaidaRequest corpo) {
		var criada = gestaoDeSaidas.criar(id, corpo.paraDados());
		return ResponseEntity.created(URI.create("/api/adm/saidas/" + criada.id())).body(criada);
	}

}
