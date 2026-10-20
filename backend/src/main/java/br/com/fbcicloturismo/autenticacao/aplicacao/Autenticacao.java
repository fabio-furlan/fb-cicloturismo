package br.com.fbcicloturismo.autenticacao.aplicacao;

import br.com.fbcicloturismo.autenticacao.dominio.Administrador;
import br.com.fbcicloturismo.autenticacao.infraestrutura.AdministradorRepository;
import br.com.fbcicloturismo.compartilhado.dominio.NaoAutenticadoException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Login do ADM. */
@Service
@Transactional(readOnly = true)
public class Autenticacao {

	/** A mesma mensagem para e-mail inexistente, senha errada e conta desativada: não revela quais e-mails existem. */
	private static final String CREDENCIAIS_INVALIDAS = "E-mail ou senha inválidos.";

	private static final String SESSAO_INVALIDA = "Sessão inválida. Entre de novo.";

	private final AdministradorRepository administradores;

	private final PasswordEncoder passwordEncoder;

	private final EmissorDeToken emissor;

	/** Hash qualquer, conferido quando o e-mail não existe, para o tempo de resposta não denunciar isso. */
	private final String hashFicticio;

	Autenticacao(AdministradorRepository administradores, PasswordEncoder passwordEncoder, EmissorDeToken emissor) {
		this.administradores = administradores;
		this.passwordEncoder = passwordEncoder;
		this.emissor = emissor;
		this.hashFicticio = passwordEncoder.encode("senha-que-ninguem-usa");
	}

	public TokenEmitido entrar(String email, String senha) {
		var encontrado = administradores.findByEmail(Administrador.normalizarEmail(email));
		if (encontrado.isEmpty()) {
			passwordEncoder.matches(senha, hashFicticio);
			throw new NaoAutenticadoException(CREDENCIAIS_INVALIDAS);
		}
		var administrador = encontrado.get();
		if (!passwordEncoder.matches(senha, administrador.getSenhaHash()) || !administrador.isAtivo()) {
			throw new NaoAutenticadoException(CREDENCIAIS_INVALIDAS);
		}
		return emissor.emitir(administrador);
	}

	/**
	 * O administrador dono do token. Um token de conta excluída ou desativada não serve mais para consultar, nem um
	 * token do Keycloak, cujo subject não é um id da tabela {@code administrador}.
	 */
	public AdministradorVisao atual(String subject) {
		long id;
		try {
			id = Long.parseLong(subject);
		}
		catch (NumberFormatException e) {
			throw new NaoAutenticadoException(SESSAO_INVALIDA);
		}
		return administradores.findById(id)
				.filter(Administrador::isAtivo)
				.map(AdministradorVisao::de)
				.orElseThrow(() -> new NaoAutenticadoException(SESSAO_INVALIDA));
	}

}
