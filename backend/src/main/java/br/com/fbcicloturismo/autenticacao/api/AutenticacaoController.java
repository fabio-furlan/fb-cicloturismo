package br.com.fbcicloturismo.autenticacao.api;

import br.com.fbcicloturismo.autenticacao.aplicacao.AdministradorVisao;
import br.com.fbcicloturismo.autenticacao.aplicacao.Autenticacao;
import br.com.fbcicloturismo.autenticacao.aplicacao.TokenEmitido;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Autenticação", description = "Login do ADM")
@RestController
@RequestMapping("/api/auth")
class AutenticacaoController {

	record LoginRequest(@NotBlank @Size(max = 160) String email, @NotBlank @Size(max = 200) String senha) {
	}

	private final Autenticacao autenticacao;

	AutenticacaoController(Autenticacao autenticacao) {
		this.autenticacao = autenticacao;
	}

	@Operation(summary = "Troca e-mail e senha por um token", description = "Envie o token em Authorization: Bearer.")
	@PostMapping("/login")
	TokenEmitido entrar(@Valid @RequestBody LoginRequest corpo) {
		return autenticacao.entrar(corpo.email(), corpo.senha());
	}

	@Operation(summary = "Administrador dono do token")
	@GetMapping("/eu")
	AdministradorVisao eu(@AuthenticationPrincipal Jwt token) {
		return autenticacao.atual(Long.parseLong(token.getSubject()));
	}

}
