package br.com.fbcicloturismo.expedicao.dominio;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.math.BigDecimal;

/**
 * Um dia de pedal do roteiro. Dias sem pedal (traslado, chegada) não têm etapa.
 *
 * @param subidaM subida acumulada do dia, em metros, quando conhecida
 */
@Embeddable
public record Etapa(
		int dia,
		String titulo,
		@Column(name = "distancia_km") BigDecimal distanciaKm,
		@Column(name = "subida_m") Integer subidaM) {
}
