package br.com.fbcicloturismo.compartilhado.seguranca;

/** Papéis gravados no token. Hoje só existe o operador do painel; inscritos virão com o módulo de inscrições. */
public final class Papeis {

	public static final String ADM = "ADM";

	/** Claim do token com os papéis do usuário. Cada papel vira a autoridade {@code ROLE_<papel>}. */
	public static final String CLAIM = "papeis";

	private Papeis() {
	}

}
