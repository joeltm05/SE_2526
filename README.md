# Sistema de Parque de Estacionamento (Entrada, Reserva, Pagamento, Push Notificações)

Este projeto implementa um website completo para gestão de um parque de estacionamento, seguindo os requisitos definidos e usando APENAS o conjunto de dependências permitido.

Funcionalidades principais:

- Entrada: a câmara/sistema de ALPR lê a matrícula e chama o endpoint que regista a entrada e atribui um lugar livre.
- Pagamento para sair: o utilizador insere a matrícula, o sistema calcula o valor e abre uma janela de saída de 15 minutos.
- Reserva: o utilizador pode reservar um lugar livre para um período entre X e Y minutos (configurável).
- Notificação: envio opcional de push (Firebase Cloud Messaging) se o cliente fornecer `pushToken`.

Arquitetura:

- Backend: Node.js + Express + Sequelize. SQLite em desenvolvimento / Postgres em produção (Neon, Supabase, Render Postgres).
- Frontend: React (Vite) + Bootstrap (classes utilitárias) + Axios.

### Whitelist de Dependências (Backend e Frontend)

Conforme restrição do projeto, apenas estas bibliotecas são utilizadas no código:

Backend: `express`, `sequelize`, `jsonwebtoken`, `firebase-admin`, `multer`, `sharp`, `axios`, `cheerio`, `dotenv`, `sqlite3`, `pg`, `pg-hstore`.

Frontend: `react`, `react-router-dom` (se presente), `axios`, `bootstrap`, `react-icons` (planeado), `chart.js` (planeado), `sweetalert2` (planeado), `html2pdf.js` (planeado).

Tooling: `npm`, `nodemon` (dev), `jest` (planeado para testes).

Objetivo: manter o projeto totalmente dentro desta lista. Qualquer lib removida anteriormente (ex.: Tailwind, nodemailer, cors, helmet, zod) **não** será reintroduzida.

## Como correr localmente (frontend otimizado para telemóveis e desktop)

Pré-requisitos: Node 18+ e npm.

1. Backend

```cmd
cd server
copy .env.example .env
npm install
npm run db:sync
npm run db:seed
npm run dev
```

O backend fica a correr em http://localhost:3001

2. Frontend (Bootstrap responsivo)

```cmd
cd web
copy .env.example .env
npm install
npm run dev
```

- Site: http://localhost:5173
- O frontend usa **Bootstrap**. As páginas estão comentadas para facilitar leitura e manutenção.

## Endpoints principais

- POST /api/entry { plate, pushToken? } -> regista entrada, atribui lugar e opcionalmente envia push.
- POST /api/reserve { plate, minutes=30, pushToken? } -> reserva um lugar livre.
- GET /api/spots -> lista estado (livre/reservado/ocupado).
- GET /api/session/:plate -> devolve estado atual da matrícula.
- POST /api/exit/payment { plate } -> calcula e regista pagamento, abre janela de 15 minutos para saída.
- POST /api/exit/confirm { plate } -> confirma saída e liberta o lugar.

### Autenticação (JWT)

- POST /api/auth/register { email, password } -> cria conta e devolve `{ token, user }`.
- POST /api/auth/login { email, password } -> devolve `{ token, user }`.

Use o token em `Authorization: Bearer <token>` para aceder aos endpoints protegidos (`/api/entry`, `/api/reserve`, `/api/exit/*`).

Tarifário de exemplo: 0,50 €/15min, com os primeiros 15 min grátis (pode ajustar em `src/routes/exit.js`).

## Push Notificações (Firebase Cloud Messaging)

Para enviar notificações push ao dispositivo (ex.: quando um lugar é atribuído) o cliente deve enviar `pushToken` nos endpoints de entrada ou reserva. O backend usa Firebase Admin. Configure o serviço com uma credencial JSON (service account) ou variáveis equivalentes.

Exemplo `.env` (service account serializado):

```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40project.iam.gserviceaccount.com"}
```

Sem configuração válida, o sistema faz fallback para `console.log` (nenhum erro crítico).

## Hosting 100% grátis (sugestões)

- Frontend (web):

  - Vercel (Plano Hobby) – deployments automáticos do repositório.
  - Netlify (Plano Gratuito).

- Backend (server):

  - Render Free Web Service (dorme após inatividade). Configure variáveis de ambiente e `Start Command: npm run start`.
  - Railway Free (tem crédito mensal gratuito; pode hibernar).
  - Fly.io Free (precisa de configuração de Docker; há camada gratuita limitada).

- Base de dados Postgres:
  - Neon.tech (Free tier) – excelente para serverless.
  - Supabase (Free) – Postgres gerido + extras.

Sugestão simples para grátis:

- Web no Vercel (ou Render Static Site).
- Server no Render (Free).
- Postgres no Render (Free) ou Neon (Free). Se Neon, defina no Render: `DB_DIALECT=postgres` e `DATABASE_URL` com a string do Neon.

## Tornar o site público (live) e 101 no Render.com

Há duas formas. Abaixo fica a recomendada (dois serviços) e a alternativa (um serviço a servir o build do frontend).

### A) Dois serviços (recomendado): API + Static Site

1. Faça push do repositório para GitHub/GitLab.
2. No Render, escolha "Blueprints" e aponte para o repositório. O ficheiro `render.yaml` já está incluído.
3. Render vai criar:

- Um serviço Web Node (server/)
- Um Static Site (web/)
- Uma base de dados Postgres (free)

4. Aguarde pelos deploys. No final terá:

- URL do backend (ex.: https://parking-backend.onrender.com)
- URL do frontend (ex.: https://parking-web.onrender.com)

5. No Static Site, defina a variável VITE_API_BASE_URL com a URL do backend e redeploy do Static Site.
6. No backend, defina CORS_ORIGIN com a URL do frontend (ou deixe `*` na fase inicial).

### B) Um serviço (alternativa): Node serve o build do Vite

1. No seu PC, faça o build do frontend:

```cmd
cd web
npm install
npm run build
```

Isto cria `web/dist`. 2. O servidor Express já está preparado para servir `web/dist` se existir. Faça push para o repositório com a pasta `web/dist` (ou adicione um passo de build no Render com dois serviços). 3. No Render crie apenas um Web Service a partir da pasta `server/`. 4. Defina a BD (Managed Postgres no Render) e variáveis:

- `DB_DIALECT=postgres`
- `DATABASE_URL` (use o Internal Connection String da BD do Render)
- `PORT=3001`
- `CORS_ORIGIN` pode ficar vazio, pois o frontend será servido pelo mesmo domínio.

5. Deploy e o site ficará acessível por uma única URL.

Notas Render úteis:

- Plano Free pode hibernar ao fim de inatividade (primeiro pedido fica mais lento).
- Ajuste CORS_ORIGIN para o domínio do frontend (A) ou deixe vazio/mesmo domínio (B).
- Pode usar a BD do Render (simples) ou o Neon (mais flexível). Se usar Neon, preencha `DATABASE_URL` com a string que o Neon fornece.

## Integração com a câmara (ALPR)

Este projeto inclui o endpoint `/api/entry` para ser chamado pela câmara/ALPR com `{ plate, email? }`. A leitura real de matrículas depende do hardware/software da câmara e não está incluída; ligue o seu sistema de ALPR para enviar um POST para este endpoint quando um veículo entra.

## Customizações

- Número de lugares: altere o seed em `server/scripts/seed.js`.
- Tarifário e janela de saída: altere `calcAmount` e os 15 minutos em `server/src/routes/exit.js`.
- CORS: ajuste `CORS_ORIGIN` no `.env` do backend.

## Segurança e produção

Autenticação (JWT) em planeamento: será introduzido `User` model com hashing via Node `crypto` (pbkdf2) e rotas de `register` / `login`. Após implementação, endpoints mutáveis poderão exigir token Bearer.

- Adicione autenticação se necessário (por ex., contas por utilizador).
- Use HTTPS nos hosts.
- Configure logs persistentes e backups da BD.

## Roadmap Próximo

- [ ] Modelo `User` + autenticação JWT.
- [ ] Middleware de autorização aplicado a entrada / reserva / pagamento.
- [ ] Endpoint de analytics para ocupação (para Chart.js).
- [ ] Página de gráficos (Chart.js) + alertas (SweetAlert2).
- [ ] Upload opcional de imagem da matrícula (Multer + Sharp) / integração futura com Supabase Storage.
- [ ] Job de expiração automática de reservas.
- [ ] Testes Jest (tarifário, regras de reserva, segurança básica dos endpoints).
- [ ] Export PDF (html2pdf) de relatório de sessões.

## Licença

MIT
