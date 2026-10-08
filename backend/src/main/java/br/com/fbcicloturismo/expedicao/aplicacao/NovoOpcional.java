package br.com.fbcicloturismo.expedicao.aplicacao;

import br.com.fbcicloturismo.expedicao.dominio.GrupoOpcional;
import java.math.BigDecimal;

public record NovoOpcional(GrupoOpcional grupo, String nome, String descricao, BigDecimal acrescimo) {
}
