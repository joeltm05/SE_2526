# Sistema de Parque de Estacionamento (Entrada, Reserva, Pagamento, Push Notificações)

Este repositório contém uma aplicação completa para gestão de um parque de estacionamento.
O projeto tem duas pastas principais:

- `server/` — API em Node.js (Express + Sequelize). Usa SQLite por omissão em desenvolvimento e Postgres em produção.
- `web/` — Frontend em React (Vite) com Bootstrap. O build do Vite produz `web/dist` que pode ser servido como static site.

As instruções abaixo descrevem como executar localmente, como configurar variáveis de ambiente e como abrir deploys no Render (Blueprints), além de dicas de resolução de problemas comuns.

## Tecnologias principais

- Backend: Node.js 18+, Express, Sequelize, sqlite3 (dev), pg (prod)
- Frontend: React + Vite, Axios, Bootstrap
- Deploy sugerido: Render (Web Service + Static Site + Managed Postgres)

## Scripts úteis

Server (`server/package.json`)

- `npm run dev` — inicia servidor em modo desenvolvimento (nodemon)
- `npm start` — inicia servidor (node src/server.js)
- `npm run db:sync` — sincroniza/esquema (scripts/sync.js)
- `npm run db:seed` — popula dados de exemplo (scripts/seed.js)
- `npm test` — executa testes (jest) se configurado

Web (`web/package.json`)

- `npm run dev` — inicia Vite em dev (http://localhost:5173)
- `npm run build` — cria build de produção em `web/dist`
- `npm run preview` — pré-visualiza o build localmente

## Como executar localmente (Windows - cmd)

1. Backend

```cmd
cd server
copy .env.example .env
npm install
npm run db:sync
npm run db:seed
npm run dev
```

O backend ficará disponível em http://localhost:3001

2. Frontend

```cmd
cd web
copy .env.example .env
npm install
npm run dev
```

O frontend ficará disponível em http://localhost:5173

OBS: Para que o frontend chame a API localmente, edite `web/.env` (ou configure `VITE_API_BASE_URL`) para `http://localhost:3001/api`.

## Variáveis de ambiente importantes

- `DB_DIALECT` — `sqlite` (default) ou `postgres` (produção)
- `DATABASE_URL` — connection string do Postgres (necessária se `DB_DIALECT=postgres`)
- `DB_SSL` — `true` se a base de dados exige SSL (ex.: Render Postgres)
- `CORS_ORIGIN` — URL do frontend (ex.: `https://parking-web.onrender.com`) ou `*` temporariamente
- `NODE_ENV` — `production`/`development`
- `VITE_API_BASE_URL` — (no Static Site) URL base do backend (ex.: `https://parking-backend.onrender.com/api`)
- `FIREBASE_SERVICE_ACCOUNT` — JSON serializado da service account (opcional, para push notifications)

Coloque variáveis sensíveis (credenciais) nas configurações de ambiente do serviço (Render) — não as commit no repositório.

## Deploy no Render (Blueprint)

Este repositório inclui um `render.yaml` com uma blueprint sugerida para:

- um Web Service para o backend (`server/`)
- um Static Site para o frontend (`web/`)
- uma Managed Postgres database (`parking-db`)

Como usar a blueprint:

1. Push do repositório para GitHub/GitLab (branch `main` recomendado).
2. No painel do Render: `New` → `Blueprint` → selecione o repositório e a branch.
3. Revise o que será criado e confirme. Render irá provisionar DB + serviços e iniciar deploys.

Nota importante sobre builds do Vite

- Em alguns ambientes (incluindo builds automáticos do Render), `npm install` é executado em modo `production` por padrão, o que omite `devDependencies` (onde o `vite` costuma estar). Isso produz erros como:

  `sh: 1: vite: Permission denied` ou `vite: not found`

- Soluções:

  - Na blueprint (`render.yaml`) ou nas configurações do Static Site em Render, use o build command:

    ```bash
    npm_config_production=false npm ci && npx vite build
    ```

    Isso força a instalação de `devDependencies` e executa a cópia local do Vite via `npx`.

  - Alternativamente, use `npm ci --include=dev` em versões recentes do npm.
  - Como último recurso, mova `vite` para `dependencies` (não recomendado).

## Flow de deploy recomendado (dois serviços)

1. Deploy do backend via blueprint / Web Service — verifique `DATABASE_URL` e `DB_DIALECT=postgres`.
2. Deploy do frontend (Static Site). Depois do backend estar ativo, defina `VITE_API_BASE_URL` com o URL do backend e re-deploy do Static Site para embutir a variável no build.
3. Configure `CORS_ORIGIN` no backend para permitir o domínio do frontend.

## Rodando migrações / seed no ambiente do Render

- Abra o serviço do backend no Render, escolha `Shell` (one-off shell) e execute:

```bash
cd server
npm ci
npm run db:sync
npm run db:seed
```

Isto criará as tabelas e popula dados iniciais.

## Endpoints principais

- POST /api/entry { plate, pushToken? }
- POST /api/reserve { plate, minutes=30, pushToken? }
- GET /api/spots
- GET /api/session/:plate
- POST /api/exit/payment { plate }
- POST /api/exit/confirm { plate }

## Dicas de debugging

- Logs do Render: verifique a aba `Logs` do serviço para erros de inicialização (DB, env vars faltando).
- CORS: se o frontend falhar nas requests por CORS, ajuste `CORS_ORIGIN` no backend.
- DB: se `DATABASE_URL` não estiver definida, o backend cairá ao inicializar quando `DB_DIALECT=postgres`.

## Personalizações rápidas

- Número de lugares: modifique `server/scripts/seed.js`.
- Tarifário e janela de saída: ajuste em `server/src/routes/exit.js`.

## Roadmap / Próximos passos

- Adicionar `User` model e autenticação JWT
- Jobs para expiração automática de reservas
- Testes automatizados com Jest
- Relatórios e export PDF

## Licença

MIT
