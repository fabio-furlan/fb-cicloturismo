# FB Cicloturismo: Frontend

Site de viagens de bike: catálogo de roteiros, área do cliente e compra de passeios.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router 7

## Rodando localmente

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos + build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Lint com oxlint |

## Estrutura

```
src/
├── app/                    inicialização da aplicação
│   ├── App.tsx             provedores globais (roteador)
│   └── Rotas.tsx           mapa de rotas → páginas (carregadas sob demanda)
├── components/
│   ├── icones/             ícones SVG reutilizáveis
│   ├── layout/             estrutura comum a todas as páginas
│   │   ├── LayoutPrincipal.tsx
│   │   ├── Cabecalho/      cabeçalho, menu desktop, menu mobile, botão Minha conta
│   │   └── Rodape/
│   └── ui/                 componentes genéricos (Logo, Container, Carregando...)
├── config/                 dados editáveis do site (menu, contato da empresa)
├── constants/              valores fixos (caminhos das rotas)
├── hooks/                  hooks reutilizáveis
├── pages/                  uma pasta por página
│   ├── Inicio/
│   │   ├── components/     componentes usados só nesta página
│   │   ├── Inicio.tsx
│   │   └── index.ts
│   ├── Roteiros/  Sobre/  Contato/  MinhaConta/  NaoEncontrada/
├── services/               comunicação com a API (backend)
├── styles/global.css       Tailwind + tema (cores e fontes)
└── types/                  tipos TypeScript compartilhados
```

## Convenções

- **Nomes em português** para páginas, componentes e funções do domínio (`Cabecalho`, `MinhaConta`, `linksNavegacao`).
- **Imports absolutos** com `@/` (ex.: `import { ROTAS } from '@/constants/rotas'`).
- **Rotas** sempre pelas constantes de `constants/rotas.ts`, nunca com o caminho escrito à mão.
- **Componente usado só por uma página** fica em `pages/<Pagina>/components/`. Se passar a ser usado em mais lugares, vai para `components/`.
- **Textos e dados da empresa** (e-mail, telefone, menu) ficam em `config/`, não espalhados pelos componentes.
- **Cores e fontes** ficam no `@theme` de `styles/global.css` (`night-*`, `amber-*`, `stone-50`).

### Adicionando uma página

1. Crie `src/pages/NovaPagina/NovaPagina.tsx` e `src/pages/NovaPagina/index.ts` (`export { NovaPagina as default } from './NovaPagina'`).
2. Adicione o caminho em `src/constants/rotas.ts`.
3. Registre a rota em `src/app/Rotas.tsx`.
4. Se ela aparecer no menu, adicione em `src/config/navegacao.ts`.

## Responsividade

Mobile first, com os breakpoints padrão do Tailwind:

- **Celular (< 768px):** menu hambúrguer em tela cheia, com o botão "Minha conta" dentro do menu.
- **Tablet/desktop (≥ 768px):** menu horizontal e botão "Minha conta" no cabeçalho.

## Imagens

`public/images/hero-bikepacking.jpg`: foto de Patrick Hendry no [Unsplash](https://unsplash.com/photos/1ow9zrlldJU), sob a Licença Unsplash (uso gratuito, inclusive comercial).
