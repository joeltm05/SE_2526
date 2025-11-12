# 📁 API de Gestão de Registos e Ficheiros

Esta aplicação é uma API REST desenvolvida com **Node.js**, **Express** e **Sequelize**, projetada para gerir utilizadores, cursos, conteúdos e operações com ficheiros. Suporta autenticação JWT, middleware de validação, CRUD dinâmico para várias entidades, e uma camada de geração de dados de teste.

---

## 🚀 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/joeltm05/backend.git
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o ficheiro `.env` com os dados da base de dados e JWT:

```
DB_NAME=
DB_USER=
DB_PASS=
DB_HOST=
DB_PORT=
JWT_SECRET=
```

4. Inicie o servidor:

```bash
npm start
```

---

## 📂 Estrutura do Projeto

| Diretório / Ficheiro | Descrição                                                  |
| -------------------- | ---------------------------------------------------------- |
| `server.js`          | Ponto de entrada principal do servidor Express             |
| `app.js`             | Configuração da aplicação e middlewares                    |
| `models/`            | Definição de todos os modelos Sequelize                    |
| `generate/`          | Scripts para gerar dados falsos para testes                |
| `controllers/`       | Lógica dos endpoints da API                                |
| `routes/`            | Definições das rotas da API                                |
| `middlewares/`       | Middlewares personalizados (auth, validação, upload, etc.) |
| `tasks/`             | Tarefas agendadas, como limpeza de tokens JWT expirados    |
| `conf/`              | Configurações de base de dados e tabelas                   |
| `files/`             | Diretório onde os ficheiros enviados são armazenados       |

---

## 🧩 Principais Funcionalidades

### 📁 Gestão de Ficheiros

| Método | Rota                  | Descrição                                           |
| ------ | --------------------- | --------------------------------------------------- |
| POST   | `/upload`             | Upload de ficheiros (formato `multipart/form-data`) |
| GET    | `/download/:filename` | Download de ficheiros armazenados localmente        |

### 🔐 Autenticação

| Método | Rota                    | Descrição                               |
| ------ | ----------------------- | --------------------------------------- |
| POST   | `/auth/regist`          | Signup com JWT                          |
| POST   | `/auth/login`           | Sign in com JWT                         |
| POST   | `/auth/update-password` | Atualizar password do utilizador logado |
| POST   | `/auth/logout`          | Logout com blacklist de token           |
| GET    | `/auth/check`           | Verifica validade do token              |

> Os tokens JWT podem ser invalidados via blacklist (ver modelo `token_blacklist`).

---

## 🛠️ CRUD Dinâmico

Sistema genérico de CRUD (Create, Read, Update, Delete) para todas as tabelas da base de dados.

| Método | Rota                                                 | Descrição                     |
| ------ | ---------------------------------------------------- | ----------------------------- |
| GET    | `/:table`                                            | Obter todos os registos       |
| GET    | `/:table/filter?column_name=value&column_name=value` | Obter registo por verificação |
| GET    | `/:table/:id`                                        | Obter registo por ID          |
| POST   | `/:table`                                            | Criar novo registo            |
| PUT    | `/:table/:id`                                        | Atualizar registo             |
| DELETE | `/:table/:id`                                        | Eliminar registo              |

> A tabela é inferida a partir do nome e validada dinamicamente com base no carregamento automático dos modelos.

---

## 🧪 Geração de Dados

Scripts localizados em `generate/` para popular tabelas com dados de teste.

Exemplos de ficheiros:

- `curso.data.js`
- `formando.data.js`
- `avaliacao.data.js`
- `topico.data.js`
- etc.

Cada ficheiro utiliza os modelos definidos e insere dados automaticamente (ideal para testes e desenvolvimento).

---

## 📦 Modelos (Exemplos)

Modelos definidos em `models/` e `models/idk/` incluem:

- `utilizador`, `formador`, `formando`, `gestor_admin`
- `curso`, `categoria`, `conteudo_curso`
- `avaliacao`, `avaliacao_post`, `avaliacao_formador`
- `inscricao`, `notificacao`, `post`, `topico`
- `file`, `trabalho_submetido`, `tipo_conteudo`, `tipo_denuncia`

Relações estão definidas dinamicamente no `models/index.js`.

---

## 🧱 Middlewares

Localizados em `middlewares/`, incluem:

- `auth.middleware.js` - Verificação de token JWT
- `routes.middleware.js` - Mapeamento de modelos via nome de tabela
- `upload.middleware.js` - Gestão de uploads com `multer`
- `validation.middleware.js` - Validação de ID e corpo das requisições

---

## 🧼 Tarefas Agendadas

No diretório `tasks/`:

- `clean_blacklist.task.js`: remove tokens expirados da blacklist

---

## 🧪 Testes

Configuração definida em `jest.config.json`.

(Nota: o projeto não inclui testes por defeito, mas já está preparado para uso com Jest.)

---

## 📘 Notas Finais

- Este backend foi pensado para ser extensível e adaptável a múltiplos tipos de utilizadores (formador, formando, gestor).
- A separação por perfis está implícita nos modelos `perfil`, `utilizador`, `formador`, `formando`, e `gestor_admin`.
- O sistema permite validações automáticas e flexíveis sem necessidade de criar controladores manuais por cada modelo.

---

## 👨‍💻 Autor

Joel Tavares Martins

---
