package br.com.fbcicloturismo.expedicao.dominio;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

/**
 * Imagem do roteiro.
 *
 * @param descricao texto alternativo, para leitores de tela
 * @param autor     crédito, para controle das licenças
 * @param origem    endereço de onde a imagem foi obtida, para controle das licenças
 */
@Embeddable
public record Imagem(
		@Enumerated(EnumType.STRING) TipoImagem tipo,
		String url,
		String descricao,
		String autor,
		String origem) {
}
