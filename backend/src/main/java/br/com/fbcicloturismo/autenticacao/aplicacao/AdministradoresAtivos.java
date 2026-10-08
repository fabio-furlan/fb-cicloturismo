package br.com.fbcicloturismo.autenticacao.aplicacao;

import br.com.fbcicloturismo.autenticacao.dominio.Administrador;
import br.com.fbcicloturismo.autenticacao.infraestrutura.AdministradorRepository;
import br.com.fbcicloturismo.compartilhado.seguranca.ContasAtivas;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Os tokens hoje são todos de administradores: o {@code sub} é o id na tabela {@code administrador}. */
@Component
class AdministradoresAtivos implements ContasAtivas {

	private final AdministradorRepository administradores;

	AdministradoresAtivos(AdministradorRepository administradores) {
		this.administradores = administradores;
	}

	@Override
	@Transactional(readOnly = true)
	public boolean estaAtiva(String subject) {
		long id;
		try {
			id = Long.parseLong(subject);
		}
		catch (NumberFormatException e) {
			return false;
		}
		return administradores.findById(id).map(Administrador::isAtivo).orElse(false);
	}

}
