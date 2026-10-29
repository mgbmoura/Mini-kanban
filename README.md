# Mini Kanban

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)]()
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)]()
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)]()

Aplicação full stack para gerenciamento pessoal de tarefas em um quadro Kanban. O projeto permite que cada usuário tenha sua própria conta, tarefas, comentários e preferências, com autenticação JWT e persistência em banco de dados.

O sistema foi pensado para ser simples, visualmente intuitivo e funcional, com foco no gerenciamento diário de atividades e organização do trabalho.


## Funcionalidades

- Cadastro, login e logout de usuários
- Recuperação de senha e redefinição por e-mail
- Quadro Kanban com colunas:
  - A Fazer
  - Em Andamento
  - Concluído
- Criação, edição, exclusão e movimentação de tarefas
- Prioridade por tarefa
- Etiquetas / labels
- Upload de imagem por URL
- Três estilos visuais de cartão
- Comentários por tarefa
- Edição de perfil
- Tema claro e escuro
- Isolamento de dados por usuário
- Documentação da API com Swagger
- Execução completa com Docker Compose

## Stack tecnológica

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- @hello-pangea/dnd

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Passport + JWT
- bcryptjs
- Swagger

### Infraestrutura
- Docker
- Docker Compose

## Estrutura do projeto

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
├── docs/
│   └── CONSTRUINDO_DO_ZERO.md
├── web/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── services/
│       ├── styles/
│       └── types/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── README.md
└── ...
