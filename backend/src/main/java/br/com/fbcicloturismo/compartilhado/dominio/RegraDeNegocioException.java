package br.com.fbcicloturismo.compartilhado.dominio;

/** A operação fere uma regra de negócio (por exemplo, reservar vaga em saída esgotada). Vira resposta 422. */
public class RegraDeNegocioException extends RuntimeException {

	public RegraDeNegocioException(String mensagem) {
		super(mensagem);
	}

}
