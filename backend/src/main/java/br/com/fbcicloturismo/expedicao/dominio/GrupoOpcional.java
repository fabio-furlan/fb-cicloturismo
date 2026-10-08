package br.com.fbcicloturismo.expedicao.dominio;

public enum GrupoOpcional {

	ACOMODACAO(true),
	EQUIPAMENTO(false),
	SERVICO(false);

	private final boolean escolhaUnica;

	GrupoOpcional(boolean escolhaUnica) {
		this.escolhaUnica = escolhaUnica;
	}

	/** Se o participante escolhe no máximo uma opção do grupo (um tipo de quarto) ou pode somar várias. */
	public boolean escolhaUnica() {
		return escolhaUnica;
	}

}
