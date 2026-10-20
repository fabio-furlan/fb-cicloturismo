interface ImportMetaEnv {
  /** Endereço da API (Spring Boot), sem barra no fim. Sem ele, o site usa os dados de exemplo. */
  readonly VITE_API_URL?: string
  /**
   * Endereço do realm do Keycloak, por exemplo `http://localhost:8180/realms/fb-cicloturismo`. Com ele, o painel do ADM
   * entra pelo Keycloak; sem ele, usa o login próprio da API.
   */
  readonly VITE_KEYCLOAK_URL?: string
  /** Cliente do realm que o site usa. Padrão: `fb-cicloturismo-web`. */
  readonly VITE_KEYCLOAK_CLIENTE?: string
}
