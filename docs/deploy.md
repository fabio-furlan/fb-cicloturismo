# Deploy

```
 Navegador ──► Vercel (frontend React)
                 │  VITE_API_URL
                 ▼
               Render (API Spring Boot, container Docker)
                 │  JDBC pelo Session pooler
                 ▼
               Supabase (PostgreSQL)
```

| Peça | Onde | Configuração no repositório |
| --- | --- | --- |
| Banco | Supabase, região **East US (N. Virginia)** | Tabelas criadas pelo Flyway (`backend/src/main/resources/db/migration`) |
| API | Render, região **Virginia**, plano Free | `render.yaml` e `backend/Dockerfile` |
| Site | Vercel | `frontend/vercel.json` |

API e banco ficam na mesma região porque cada requisição faz várias consultas: a distância entre eles pesa mais que a
distância entre o visitante e a API. O Render não tem região na América do Sul, por isso os dois ficam nos EUA.

A ordem importa: banco, depois API (que precisa do banco), depois site (que precisa da URL da API).

## 1. Banco no Supabase

1. Em [supabase.com](https://supabase.com), crie um projeto. Região: **East US (North Virginia)**.
2. Guarde a senha do banco num gerenciador de senhas. Ela não aparece de novo.
3. Em **Security**, desmarque **Enable Data API** e **Automatically expose new tables**: só a API Java acessa o banco,
   e a Data API abriria um segundo caminho até as tabelas. **Enable automatic RLS** pode ficar marcado.
4. No projeto, clique em **Connect**, aba **Direct**, com **Type: JDBC** e **Method: Session pooler**. Copie os dados
   da conexão:
   - host (algo como `aws-0-us-east-1.pooler.supabase.com`), porta `5432`, banco `postgres`;
   - usuário no formato `postgres.<id-do-projeto>`.

Use o **Session pooler** e não as outras opções:

- a conexão direta (`db.<id>.supabase.co`) só funciona por IPv6, e o Render não tem saída IPv6;
- o Transaction pooler (porta 6543) não mantém a sessão entre comandos, o que quebra as migrations do Flyway e os
  prepared statements do driver JDBC.

Não crie tabelas pelo painel. Na primeira subida, a API aplica as migrations e cria tudo.

## 2. API no Render

1. Em [render.com](https://render.com), entre com a conta do GitHub e clique em **New > Blueprint**.
2. Escolha o repositório `fb-cicloturismo`. O Render lê o `render.yaml` da raiz e mostra o serviço
   `fb-cicloturismo-api`.
3. Preencha as variáveis que ele pedir:

| Variável | Valor |
| --- | --- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<host do pooler>:5432/postgres?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | `postgres.<id-do-projeto>` |
| `SPRING_DATASOURCE_PASSWORD` | a senha do banco |
| `APP_ADMIN_EMAIL` | o e-mail com que você vai entrar no painel |
| `APP_ADMIN_SENHA` | uma senha com pelo menos 12 caracteres |
| `APP_CORS_ORIGENS` | o endereço do site, por exemplo `https://fb-cicloturismo.vercel.app` (sem barra no fim) |

Acrescente também, em **Environment**, estas duas variáveis:

| Variável | Valor |
| --- | --- |
| `SPRING_FLYWAY_BASELINE_ON_MIGRATE` | `true` |
| `SPRING_FLYWAY_BASELINE_VERSION` | `0` |

O Supabase já cria objetos no esquema `public` (a opção de RLS automático cria uma função lá). Sem essas variáveis, o
Flyway encontra o esquema "não vazio" e para com *Found non-empty schema(s) "public" but no schema history table*. O
`0` é obrigatório: com o padrão (1), a migration V1 seria pulada e as tabelas principais não seriam criadas.

O `APP_JWT_SEGREDO` não aparece na lista: o Render o gera sozinho. Se ainda não souber o endereço da Vercel, coloque
um valor provisório e corrija no passo 4.

4. Clique em **Apply**. O primeiro build leva alguns minutos (o Maven baixa as dependências).
5. Quando o serviço ficar **Live**, confira:
   - `https://<seu-servico>.onrender.com/actuator/health` responde `{"status":"UP"}`;
   - `https://<seu-servico>.onrender.com/docs` abre o Swagger;
   - no Swagger, `POST /api/auth/login` com o e-mail e a senha do passo 3 devolve um token.

O administrador é criado só quando não existe nenhum. Depois do primeiro boot, trocar `APP_ADMIN_SENHA` não muda a
senha da conta. Se quiser, apague essa variável no painel: ela não é mais usada.

## 3. Site na Vercel

1. No projeto da Vercel (diretório raiz `frontend`), abra **Settings > Environment Variables**.
2. Crie `VITE_API_URL` com o endereço do Render, sem barra no fim: `https://<seu-servico>.onrender.com`.
3. Abra **Deployments** e faça **Redeploy** do último deploy. O Vite grava a variável no build, então ela só vale num
   build novo.

## 4. Ajuste final do CORS

Se o `APP_CORS_ORIGENS` do Render ficou com um valor provisório, troque pelo endereço definitivo do site. O Render
reinicia o serviço sozinho. Os previews da Vercel têm outro endereço (`...-git-<branch>-...vercel.app`); para testá-los
contra a API, acrescente o endereço separado por vírgula.

## Trocar a senha do administrador

Ainda não há tela para isso. O administrador inicial só é criado quando não existe nenhum, então:

1. No Supabase, **Table Editor > administrador**: apague a linha do administrador.
2. No Render, **Environment**: troque `APP_ADMIN_SENHA` e clique em **Save, rebuild, and deploy**.
3. No primeiro boot, a API cria o administrador de novo com a senha nova (`Administrador inicial ... criado` no log).

Os tokens emitidos para a conta apagada deixam de valer na hora: a cada requisição, a API confere se a conta dona do
token ainda existe e está ativa. Para invalidar **todos** os tokens de uma vez, troque também o `APP_JWT_SEGREDO`.

## Depois do deploy

- Cada merge na `main` dispara um deploy novo da API (Render) e do site (Vercel).
- **Plano gratuito do Render:** a API dorme depois de 15 minutos sem acesso, e a primeira visita seguinte leva de 30 a
  60 segundos. O site mostra o estado de carregando nesse meio-tempo.
- **Plano gratuito do Supabase:** o projeto é pausado depois de 7 dias sem atividade. É só reativar no painel.
- O banco fica vazio no começo. Cadastre os roteiros e publique as saídas pelo painel do ADM (ou pelo Swagger). Até
  haver uma saída publicada, o site mostra que não há viagens com esses filtros.

## Variáveis da API

| Variável | Obrigatória | Padrão | Para que serve |
| --- | --- | --- | --- |
| `SPRING_DATASOURCE_URL` | sim | | Endereço JDBC do banco |
| `SPRING_DATASOURCE_USERNAME` | sim | | Usuário do banco |
| `SPRING_DATASOURCE_PASSWORD` | sim | | Senha do banco |
| `APP_JWT_SEGREDO` | sim | aleatório a cada início | Chave HS256 dos tokens, com 32 caracteres ou mais |
| `APP_CORS_ORIGENS` | sim | `http://localhost:5173` | Endereços do site autorizados a chamar a API |
| `APP_ADMIN_EMAIL` / `APP_ADMIN_SENHA` | no primeiro boot | | Primeiro administrador |
| `APP_ADMIN_NOME` | não | `Administrador` | Nome do primeiro administrador |
| `APP_JWT_VALIDADE` | não | `8h` | Validade do token de login |
| `APP_DB_POOL_MAXIMO` | não | `5` | Conexões simultâneas com o banco |
| `PORT` | não | `8080` | Porta HTTP (o Render define sozinho) |
