package br.com.fbcicloturismo.autenticacao.aplicacao;

import br.com.fbcicloturismo.autenticacao.dominio.Administrador;
import br.com.fbcicloturismo.compartilhado.seguranca.Papeis;
import br.com.fbcicloturismo.compartilhado.seguranca.PropriedadesJwt;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

/** Gera o JWT do ADM: o subject é o id do administrador e o claim {@value Papeis#CLAIM} leva o papel. */
@Component
class EmissorDeToken {

	static final String EMISSOR = "fb-cicloturismo-api";

	private final JwtEncoder encoder;

	private final PropriedadesJwt propriedades;

	private final Clock clock;

	EmissorDeToken(JwtEncoder encoder, PropriedadesJwt propriedades, Clock clock) {
		this.encoder = encoder;
		this.propriedades = propriedades;
		this.clock = clock;
	}

	TokenEmitido emitir(Administrador administrador) {
		Instant agora = clock.instant();
		Instant expiraEm = agora.plus(propriedades.validade());
		var claims = JwtClaimsSet.builder()
				.issuer(EMISSOR)
				.subject(administrador.getId().toString())
				.issuedAt(agora)
				.expiresAt(expiraEm)
				.claim("nome", administrador.getNome())
				.claim(Papeis.CLAIM, List.of(Papeis.ADM))
				.build();
		var cabecalho = JwsHeader.with(MacAlgorithm.HS256).build();
		String token = encoder.encode(JwtEncoderParameters.from(cabecalho, claims)).getTokenValue();
		return new TokenEmitido(token, expiraEm, AdministradorVisao.de(administrador));
	}

}
