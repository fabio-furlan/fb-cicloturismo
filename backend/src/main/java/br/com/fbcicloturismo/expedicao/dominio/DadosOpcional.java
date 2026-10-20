package br.com.fbcicloturismo.expedicao.dominio;

import java.math.BigDecimal;

/** Os dados de um {@link Opcional} a acrescentar numa saída. */
public record DadosOpcional(GrupoOpcional grupo, String nome, String descricao, BigDecimal acrescimo) {
}
