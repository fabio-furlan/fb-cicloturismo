package br.com.fbcicloturismo.institucional.dominio;

import jakarta.persistence.Embeddable;

/**
 * Um ponto da linha do tempo da página "Sobre nós".
 *
 * @param rotulo o momento, curto ("A primeira travessia", "2019", "Hoje")
 */
@Embeddable
public record Marco(String rotulo, String titulo, String texto) {
}
