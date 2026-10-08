package br.com.fbcicloturismo.expedicao.api;

import br.com.fbcicloturismo.expedicao.aplicacao.NovoOpcional;
import br.com.fbcicloturismo.expedicao.dominio.GrupoOpcional;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

record OpcionalRequest(
		@NotNull GrupoOpcional grupo,
		@NotBlank @Size(max = 120) String nome,
		@Size(max = 255) String descricao,
		@NotNull @PositiveOrZero @Digits(integer = 8, fraction = 2) BigDecimal acrescimo) {

	NovoOpcional paraNovoOpcional() {
		return new NovoOpcional(grupo, nome, descricao, acrescimo);
	}

}
