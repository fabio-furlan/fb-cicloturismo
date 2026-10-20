/**
 * API da Fábio Cicloturismo, organizada por funcionalidade. Cada módulo ({@code expedicao}, {@code autenticacao}) tem as
 * camadas {@code api} → {@code aplicacao} → {@code dominio}, com {@code infraestrutura} para a persistência. Os
 * módulos não se conhecem; o que é comum fica em {@code compartilhado}. O {@code ArquiteturaTest} confere essas regras.
 */
package br.com.fbcicloturismo;
