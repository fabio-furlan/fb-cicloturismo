package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.expedicao.dominio.PeriodoSaida;
import java.math.BigDecimal;

/** Os dados editáveis de uma saída. Os opcionais são geridos à parte. */
public record DadosSaida(PeriodoSaida periodo, int capacidade, BigDecimal precoBase) {
}
