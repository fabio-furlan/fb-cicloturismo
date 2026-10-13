import { clsx, type ClassValue } from 'clsx'

/**
 * Junta classes do Tailwind, aceitando condições: `cn('base', ativo && 'ativa', className)`.
 *
 * Não resolve conflitos entre classes, de propósito: um componente e quem o usa nunca mexem na mesma propriedade. O
 * componente oferece variantes (`tamanho`, `tom`, `variante`) e quem o usa só acrescenta o que é do lugar onde ele está
 * (margem, largura, posição). Assim o resultado não depende da ordem das classes, e o site não carrega uma biblioteca
 * de resolução de conflitos no pacote inicial.
 */
export const cn = (...classes: ClassValue[]) => clsx(classes)
