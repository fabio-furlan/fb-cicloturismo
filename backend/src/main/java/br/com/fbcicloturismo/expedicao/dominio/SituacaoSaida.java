package br.com.fbcicloturismo.expedicao.dominio;

/** Situação editorial da saída, definida pelo ADM. É o único estado gravado; o resto é calculado ({@link StatusSaida}). */
public enum SituacaoSaida {
	RASCUNHO, PUBLICADA, CANCELADA
}
