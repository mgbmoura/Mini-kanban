# Mini-Kanban

Sistema de gerenciamento de tarefas estilo Kanban com autenticação, desenvolvido como parte de um desafio técnico para vaga de Desenvolvedor Fullstack Junior/Trainee.

## 🎯 Sobre o Projeto

Mini-Kanban é uma aplicação completa de quadro Kanban que permite:
- ✅ Autenticação de usuários (Login/Cadastro)
- ✅ Criação, edição e exclusão de tarefas
- ✅ Organização de tarefas em colunas (To Do, In Progress, Done)
- ✅ Definição de prioridades (Alta, Média, Baixa)
- ✅ Adição de descrições, tags e imagens às tarefas
- ✅ Interface dark mode moderna e responsiva

## 🚀 Tecnologias Utilizadas

### Frontend (Implementado)
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS v4** para estilização
- **Lucide React** para ícones
- **localStorage** para persistência temporária

### Backend (Preparado para integração)
- **NestJS** com TypeScript
- **Prisma ORM** com PostgreSQL
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Docker & Docker Compose**

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # Cabeçalho com logo e avatar
│   │   ├── Sidebar.tsx         # Menu lateral com navegação
│   │   ├── LoginPage.tsx       # Tela de login/cadastro
│   │   ├── KanbanBoard.tsx     # Quadro principal
│   │   ├── KanbanColumn.tsx    # Coluna do quadro
│   │   ├── KanbanCard.tsx      # Card de tarefa
│   │   └── TaskModal.tsx       # Modal de criação/edição
│   └── App.tsx                 # Componente principal
├── services/
│   ├── authService.ts          # Serviço de autenticação (mockado)
│   ├── taskService.ts          # Serviço de tasks (mockado)
│   └── api.ts                  # Cliente HTTP preparado para backend
└── styles/
    └── theme.css               # Tokens de design dark theme
```

## 🔧 Como Executar

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

## 💡 Funcionalidades Implementadas

### Autenticação
- [x] Cadastro de usuário (email + senha + nome)
- [x] Login (email + senha)
- [x] Logout (client-side)
- [x] Proteção de rotas
- [x] Persistência de sessão com localStorage

### Gerenciamento de Tarefas
- [x] Listar tarefas por status (TODO/DOING/DONE)
- [x] Criar nova tarefa
- [x] Editar tarefa (título, descrição, status, prioridade, tags)
- [x] Excluir tarefa
- [x] Adicionar imagens via URL
- [x] Sistema de tags com cores
- [x] Indicador visual de prioridade (borda colorida)

### Interface
- [x] Design dark theme moderno
- [x] Totalmente responsivo (mobile-first)
- [x] Menu hamburguer funcional em todas as plataformas
- [x] Modal completo para edição de tarefas
- [x] Estados de loading
- [x] Tratamento de erros

## 🔌 Integração com Backend

O projeto está estruturado para fácil integração com backend NestJS. Os arquivos mockados podem ser facilmente substituídos:

### 1. Configure a URL da API

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3000
```

### 2. Substitua os serviços mockados

```typescript
// authService.ts - Exemplo de migração para API real
import { authApi } from './api';

export const authService = {
  async login(email: string, password: string) {
    const response = await authApi.login(email, password);
    this.saveAuth(response.accessToken, response.user);
    return response;
  },
  // ... demais métodos
};
```

### 3. Endpoints Esperados no Backend

```
POST   /auth/register    - Cadastro de usuário
POST   /auth/login       - Login
GET    /tasks            - Listar tasks (autenticado)
POST   /tasks            - Criar task (autenticado)
PATCH  /tasks/:id        - Atualizar task (autenticado)
DELETE /tasks/:id        - Deletar task (autenticado)
```

## 📝 Contrato de Dados

### Task
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'DOING' | 'DONE';
  priority: 'high' | 'medium' | 'low';
  tags?: string[];
  attachmentImage?: string;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
```

### User
```typescript
{
  id: string;
  email: string;
  name: string;
}
```

## 🎨 Design System

- **Cores primárias**: Violeta (#7c3aed) e roxo (#4f46e5)
- **Background**: Dark (#16161f, #1e1e2e, #262637)
- **Tipografia**: Inter (system fallback)
- **Bordas**: Radius de 0.625rem
- **Prioridades**:
  - Alta: Vermelho (#ef4444)
  - Média: Âmbar (#f59e0b)
  - Baixa: Azul (#3b82f6)

## 📦 Próximos Passos para Backend

1. Criar projeto NestJS com TypeScript
2. Configurar Prisma com PostgreSQL
3. Implementar módulo de autenticação (@nestjs/jwt + passport-jwt)
4. Implementar módulo de tasks com ownership validation
5. Configurar Docker Compose (postgres, api, web)
6. Adicionar migrations do Prisma
7. Integrar frontend com backend usando `/src/services/api.ts`

## 🤝 Contribuindo

Este projeto foi desenvolvido como desafio técnico. Sugestões e melhorias são bem-vindas!

## 📄 Licença

MIT

---

Desenvolvido com 💜 para o desafio de Desenvolvedor Fullstack Junior/Trainee
