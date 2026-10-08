package br.com.fbcicloturismo.compartilhado.seguranca;

/**
 * Diz se o dono de um token ainda pode usar a API. Um JWT continua bem assinado e dentro do prazo mesmo depois que a
 * conta é removida ou desativada; esta checagem, feita a cada requisição autenticada, corta o acesso na hora. A
 * implementação fica no módulo de autenticação, que conhece as contas.
 */
public interface ContasAtivas {

	/** @param subject o {@code sub} do token, isto é, o id da conta */
	boolean estaAtiva(String subject);

}
