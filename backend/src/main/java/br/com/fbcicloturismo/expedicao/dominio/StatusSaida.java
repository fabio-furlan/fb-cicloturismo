package br.com.fbcicloturismo.expedicao.dominio;

/** Status exibido no dashboard, calculado a partir da situação, das datas e das vagas da saída. */
public enum StatusSaida {
	RASCUNHO,
	CANCELADA,
	ABERTA,
	ESGOTADA,
	INSCRICOES_ENCERRADAS,
	EM_ANDAMENTO,
	FINALIZADA
}
