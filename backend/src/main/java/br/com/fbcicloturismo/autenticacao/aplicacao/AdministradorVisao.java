package br.com.fbcicloturismo.autenticacao.aplicacao;

import br.com.fbcicloturismo.autenticacao.dominio.Administrador;

/** Dados públicos do administrador. Nunca inclui o hash da senha. */
public record AdministradorVisao(Long id, String nome, String email) {

	static AdministradorVisao de(Administrador administrador) {
		return new AdministradorVisao(administrador.getId(), administrador.getNome(), administrador.getEmail());
	}

}
