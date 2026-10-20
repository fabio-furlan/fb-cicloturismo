package br.com.fbcicloturismo.expedicao.dominio;

import java.math.BigDecimal;

/** Os dados editáveis de uma {@link Saida}. Os opcionais são geridos à parte ({@link DadosOpcional}). */
public record DadosSaida(PeriodoSaida periodo, int capacidade, BigDecimal precoBase) {
}
