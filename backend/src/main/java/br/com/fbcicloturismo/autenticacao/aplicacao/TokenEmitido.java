package br.com.fbcicloturismo.autenticacao.aplicacao;

import java.time.Instant;

/** Resposta do login: o token para o cabeçalho {@code Authorization: Bearer} e quando ele expira. */
public record TokenEmitido(String tipo, String token, Instant expiraEm, AdministradorVisao administrador) {

	TokenEmitido(String token, Instant expiraEm, AdministradorVisao administrador) {
		this("Bearer", token, expiraEm, administrador);
	}

}
