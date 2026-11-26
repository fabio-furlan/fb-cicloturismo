package br.com.fbcicloturismo.institucional.dominio;

import jakarta.persistence.Embeddable;

/**
 * Foto da página "Sobre nós".
 *
 * @param descricao texto alternativo, para leitores de tela
 * @param legenda   frase que aparece embaixo da foto; opcional
 */
@Embeddable
public record FotoSobre(String url, String descricao, String legenda) {
}
