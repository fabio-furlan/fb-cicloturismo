# Estudo: Keycloak

Ambiente local para entender o Keycloak antes de integrá-lo à API e ao painel. **Nada do projeto usa o Keycloak
ainda**: o login do ADM continua sendo o JWT próprio da API.

## Subir e derrubar

Com o Docker Desktop aberto, na pasta `backend`:

```bash
docker compose --profile keycloak up -d      # sobe (leva uns 40 s na primeira vez)
docker compose --profile keycloak stop       # para, mantendo o que foi alterado
docker compose --profile keycloak down       # remove o container (o volume continua)
docker volume rm backend_dados-keycloak      # apaga tudo: na próxima subida o realm é importado de novo
```

O Keycloak fica num *profile* do `compose.yaml`: o `docker compose up` comum e o início da API sobem só o Postgres.

## O que já vem configurado

O arquivo [`backend/keycloak/fb-cicloturismo-realm.json`](../backend/keycloak/fb-cicloturismo-realm.json) é importado
na primeira subida.

| Item | Valor | Para quê |
| --- | --- | --- |
| Painel de administração | http://localhost:8180 (`admin` / `admin`) | Gerenciar realms, usuários, papéis e clientes |
| Realm | `fb-cicloturismo` | O "espaço" com os usuários e as regras deste sistema |
| Papel | `ADM` | O mesmo papel que a API já exige em `/api/adm/**` |
| Cliente | `painel-adm` (público, PKCE obrigatório) | O frontend React. Público porque roda no navegador e não guarda segredo |
| Usuário com papel ADM | `adm` / `pedal-forte-2026` | |
| Usuário sem papel | `visitante` / `pedal-leve-2026` | Para comparar os tokens |
| Proteção contra força bruta | 5 erros bloqueiam temporariamente | |
| Política de senha | 12 caracteres, diferente do usuário | A mesma regra do `AdministradorInicial` |
| Validade do token | 5 minutos (sessão de até 8 h) | Token curto, renovado em silêncio pelo frontend |

As senhas acima são só deste ambiente local.

## Roteiro de estudo

**1. O login acontece fora do seu sistema.** Abra o console de conta do realm, que é uma aplicação de exemplo do
próprio Keycloak: http://localhost:8180/realms/fb-cicloturismo/account. O navegador é redirecionado para a tela de login
do Keycloak, e depois volta. Esse é o mesmo fluxo que o painel do ADM teria.

**2. A senha no F12.** Repita o passo 1 com o F12 aberto, na aba *Network*. A senha aparece no POST para
`.../login-actions/authenticate`, e isso é esperado: o DevTools mostra o que o seu próprio navegador envia, em
qualquer site. O que muda com o Keycloak é **para onde** ela vai. Ela vai só para o Keycloak; o frontend e a API
nunca a recebem. Eles recebem um *código*, que é trocado por um token. Em produção, o HTTPS protege a senha no
caminho.

**3. Por dentro do token.** No painel: *fb-cicloturismo* → *Clients* → `painel-adm` → *Client scopes* →
*Evaluate*. Escolha o usuário `adm` e abra *Generated access token*. Repare em:
- `iss`: quem emitiu o token. É o endereço que a API usaria para confiar nele.
- `papeis`: um *mapper* do cliente copia os papéis do usuário para esse claim, que é o mesmo nome que a API já lê
  (`Papeis.CLAIM`). Compare com o usuário `visitante`, que não tem `ADM`.
- `exp`: o token vale 5 minutos.

Cole o token em https://jwt.io para ver o cabeçalho: `RS256`, assinado com uma chave privada que só o Keycloak tem.

**4. Como a API confiaria no token.** Abra
http://localhost:8180/realms/fb-cicloturismo/.well-known/openid-configuration. É o "cartão de visita" do realm, com
todos os endereços. O `jwks_uri` publica as **chaves públicas**. Hoje a API assina e confere tokens com um segredo
HMAC compartilhado; com o Keycloak ela só confere, usando essas chaves públicas, e não guarda segredo nenhum.

**5. PKCE.** O cliente exige PKCE: o frontend gera um segredo aleatório a cada login e manda só o *hash* dele na ida.
Na troca do código pelo token, manda o segredo original. Quem interceptar o código não consegue trocá-lo. Sem PKCE, o
Keycloak recusa o pedido antes de mostrar a tela de login (`Missing parameter: code_challenge_method`).

**6. Recursos que viriam de graça.** Erre a senha 5 vezes e veja o bloqueio (o desbloqueio fica em *Users* → `adm`).
Explore também *Authentication* → *Required actions* (por exemplo, OTP com um app autenticador) e *Identity
providers* (login com Google).

## Como seria a integração (ainda não feita)

- **API:** troca o segredo HMAC por `spring.security.oauth2.resourceserver.jwt.issuer-uri` apontando para o realm.
  Saem o `EmissorDeToken`, o `Autenticacao`, o `AdministradorInicial`, a tabela `administrador` e o
  `PasswordEncoder`. A checagem de papéis continua igual, porque o token já traz o claim `papeis`.
- **Painel:** sai a tela de login própria. Entra o redirecionamento ao Keycloak com `keycloak-js` ou
  `oidc-client-ts`, que também renovam o token sozinhas.
- **Produção:** o `start-dev` deste ambiente usa banco embutido e HTTP. Em produção o Keycloak roda com `start`,
  Postgres próprio, HTTPS e `hostname` configurado, e precisa de uns 512 MB a 1 GB de RAM.
