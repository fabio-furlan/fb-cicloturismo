package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.expedicao.dominio.DadosOpcional;
import br.com.fbcicloturismo.expedicao.dominio.DadosSaida;
import br.com.fbcicloturismo.expedicao.dominio.PeriodoSaida;
import br.com.fbcicloturismo.expedicao.dominio.Saida;
import br.com.fbcicloturismo.expedicao.infraestrutura.RoteiroRepository;
import br.com.fbcicloturismo.expedicao.infraestrutura.SaidaRepository;
import java.time.Clock;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Cadastro das saídas (edições vendáveis) de um roteiro e dos seus opcionais, pelo ADM. */
@Service
@Transactional
public class GestaoDeSaidas {

	private final SaidaRepository saidas;

	private final RoteiroRepository roteiros;

	private final Clock clock;

	GestaoDeSaidas(SaidaRepository saidas, RoteiroRepository roteiros, Clock clock) {
		this.saidas = saidas;
		this.roteiros = roteiros;
		this.clock = clock;
	}

	/** Cria a saída como rascunho; ela só aparece para venda depois de {@link #publicar(long) publicada}. */
	public SaidaVisao criar(long roteiroId, DadosSaida dados) {
		var saida = saidas.save(new Saida(roteiros.carregar(roteiroId), dados));
		return visao(saida);
	}

	public SaidaVisao alterar(long id, DadosSaida dados) {
		var saida = saidas.carregar(id);
		saida.alterar(dados);
		return visao(saida);
	}

	@Transactional(readOnly = true)
	public SaidaVisao buscar(long id) {
		return visao(saidas.carregar(id));
	}

	public SaidaVisao publicar(long id) {
		var saida = saidas.carregar(id);
		saida.publicar();
		return visao(saida);
	}

	public SaidaVisao cancelar(long id) {
		var saida = saidas.carregar(id);
		saida.cancelar();
		return visao(saida);
	}

	/** Copia a saída, com capacidade, preço e opcionais, para novas datas. A cópia nasce como rascunho. */
	public SaidaVisao duplicar(long id, PeriodoSaida periodo) {
		var copia = saidas.save(saidas.carregar(id).duplicarPara(periodo));
		return visao(copia);
	}

	public SaidaVisao adicionarOpcional(long saidaId, DadosOpcional opcional) {
		var saida = saidas.carregar(saidaId);
		saida.adicionarOpcional(opcional);
		// Grava já, para o opcional novo voltar com o id gerado pelo banco.
		saidas.flush();
		return visao(saida);
	}

	public SaidaVisao removerOpcional(long saidaId, long opcionalId) {
		var saida = saidas.carregar(saidaId);
		saida.removerOpcional(opcionalId);
		return visao(saida);
	}

	public void excluir(long id) {
		var saida = saidas.carregar(id);
		saida.validarExclusao();
		saidas.delete(saida);
	}

	private SaidaVisao visao(Saida saida) {
		return SaidaVisao.de(saida, LocalDate.now(clock));
	}

}
