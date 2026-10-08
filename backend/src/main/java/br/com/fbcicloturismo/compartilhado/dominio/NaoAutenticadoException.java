package br.com.fbcicloturismo.compartilhado.dominio;

/** Credenciais ausentes ou inválidas. Vira resposta 401. */
public class NaoAutenticadoException extends RuntimeException {

	public NaoAutenticadoException(String mensagem) {
		super(mensagem);
	}

}
