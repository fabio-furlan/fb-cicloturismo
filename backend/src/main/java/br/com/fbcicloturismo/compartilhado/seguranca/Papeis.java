package br.com.fbcicloturismo.compartilhado.seguranca;

/** Papéis gravados no token. */
public final class Papeis {

	/** Opera o painel: roteiros, saídas e opcionais. */
	public static final String ADM = "ADM";

	/** Quem cria a própria conta no site para se inscrever nas saídas. No Keycloak, todo cadastro novo recebe este. */
	public static final String CLIENTE = "CLIENTE";

	/** Claim do token com os papéis do usuário. Cada papel vira a autoridade {@code ROLE_<papel>}. */
	public static final String CLAIM = "papeis";

	private Papeis() {
	}

}
