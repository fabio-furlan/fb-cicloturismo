import type { ReactNode } from 'react'
import { keycloakConfigurado } from './keycloak'
import { ProvedorKeycloak } from './ProvedorKeycloak'
import { ProvedorLoginProprio } from './ProvedorLoginProprio'

/**
 * A sessão do painel. Com `VITE_KEYCLOAK_URL`, o login é pelo Keycloak; sem ela, pelo login próprio da API. As telas
 * não sabem qual dos dois está em uso: as duas formas entregam o mesmo contexto.
 */
export function ProvedorSessaoAdm({ children }: { children: ReactNode }) {
  return keycloakConfigurado() ? <ProvedorKeycloak>{children}</ProvedorKeycloak> : <ProvedorLoginProprio>{children}</ProvedorLoginProprio>
}
