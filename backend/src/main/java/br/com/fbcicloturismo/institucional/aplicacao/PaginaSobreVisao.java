package br.com.fbcicloturismo.institucional.aplicacao;

import br.com.fbcicloturismo.institucional.dominio.FotoSobre;
import br.com.fbcicloturismo.institucional.dominio.Marco;
import br.com.fbcicloturismo.institucional.dominio.PaginaSobre;
import java.time.Instant;
import java.util.List;

/** A página "Sobre nós" como o site e o painel a recebem. */
public record PaginaSobreVisao(
		String titulo,
		String chamada,
		String historia,
		String citacao,
		List<Marco> marcos,
		List<FotoSobre> fotos,
		Instant atualizadoEm) {

	static PaginaSobreVisao de(PaginaSobre pagina) {
		return new PaginaSobreVisao(pagina.getTitulo(), pagina.getChamada(), pagina.getHistoria(), pagina.getCitacao(),
				pagina.getMarcos(), pagina.getFotos(), pagina.getAtualizadoEm());
	}

}
