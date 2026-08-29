# Mini Kanban

Aplicação full stack para gerenciamento pessoal de tarefas em um quadro Kanban. Cada usuário possui sua própria conta, tarefas e comentários, com autenticação por JWT e persistência em PostgreSQL.

## Funcionalidades

- cadastro, login, logout e redefinição de senha;
- quadro com as colunas A Fazer, Em Andamento e Concluído;
- criação, edição, movimentação e exclusão de tarefas;
- prioridade, etiquetas, imagem por URL e três estilos visuais de cartão;
- comentários por tarefa;
- edição de perfil e tema claro/escuro;
- isolamento das tarefas e comentários por usuário;
- documentação da API com Swagger.

## Tecnologias principais

### Frontend

- React 18;
- TypeScript;
- Vite;
- Tailwind CSS;
- React Router;
- Axios;
- `@hello-pangea/dnd` para arrastar e soltar.

### Backend

- NestJS;
- TypeScript;
- Prisma ORM;
- PostgreSQL;
- Passport + JWT;
- bcryptjs;
- Swagger.

### Infraestrutura

- Docker;
- Docker Compose.

## Estrutura

```text
mini-kanban/
├── api/
│   ├── prisma/
│   └── src/
│       ├── autenticacao/
│       ├── comentarios/
│       ├── email/
│       ├── prisma/
│       ├── tarefas/
│       └── usuarios/
├── web/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── services/
│       ├── styles/
│       └── types/
└── docker-compose.yml
```

No frontend, as nomenclaturas do domínio são mantidas em português. Os serviços HTTP fazem a conversão entre os modelos usados pela interface e o contrato da API, preservando campos e rotas existentes.

## Executando com Docker

1. Copie `.env.example` para `.env` e preencha as variáveis necessárias.
2. Na raiz do projeto, execute:

```bash
docker compose up --build
```

Serviços disponíveis:

- aplicação web: `http://localhost:8080`;
- API: `http://localhost:3000/api`;
- Swagger: `http://localhost:3000/api/docs`;
- PostgreSQL: porta `5432`.

Na inicialização, o container da API executa `prisma migrate deploy` antes de iniciar o NestJS.

## Testes

Backend:

```bash
cd api
npm test
```

Frontend:

```bash
cd web
npm test
```
