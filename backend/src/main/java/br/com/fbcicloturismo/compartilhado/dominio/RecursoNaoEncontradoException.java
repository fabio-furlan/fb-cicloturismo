package br.com.fbcicloturismo.compartilhado.dominio;

/** O recurso pedido não existe. Vira resposta 404. */
public class RecursoNaoEncontradoException extends RuntimeException {

	public RecursoNaoEncontradoException(String mensagem) {
		super(mensagem);
	}

}
