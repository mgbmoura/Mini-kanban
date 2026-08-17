# Mini Kanban

Aplicação full stack para organizar tarefas em três etapas: a fazer, em andamento e concluído.

## Funcionalidades

- cadastro, login e recuperação de senha;
- tarefas separadas por usuário;
- criação, edição e exclusão de tarefas;
- movimentação e reordenação de cards por arrastar e soltar;
- prioridades, imagens e comentários;
- perfil do usuário e tema claro/escuro;
- documentação da API com Swagger.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 18, TypeScript, Vite e Tailwind CSS |
| API | NestJS, Prisma, JWT e bcrypt |
| Banco | PostgreSQL |
| Ambiente | Docker Compose |

## Como executar

Pré-requisitos: Docker e Docker Compose.

```bash
cp .env.example .env
docker compose up --build
```

Depois que os serviços iniciarem:

- aplicação: `http://localhost:8080`;
- API: `http://localhost:3000/api`;
- Swagger: `http://localhost:3000/api/docs`.

Para encerrar:

```bash
docker compose down
```

## Desenvolvimento sem Docker

Frontend:

```bash
cd web
pnpm install
pnpm dev
```

API:

```bash
cd api
pnpm install
npx prisma generate
pnpm start:dev
```

A API precisa de um PostgreSQL disponível e da variável `DATABASE_URL` configurada.

## Testes

```bash
cd web && pnpm test --run
cd api && pnpm test --runInBand
```

## Estrutura

```text
api/
  prisma/          schema e migrações do banco
  src/auth/        autenticação e recuperação de senha
  src/comments/    comentários das tarefas
  src/tasks/       regras e endpoints das tarefas
  src/users/       cadastro e perfil
web/
  src/api/         cliente HTTP e chamadas da API
  src/app/pages/   páginas da aplicação
  src/components/  componentes visuais
  src/contexts/    tema da interface
  src/hooks/       estado de autenticação
```

O backend usa o ID do token JWT para filtrar tarefas e validar alterações. Assim, cada usuário acessa apenas os próprios dados.
