# 🏆 Desafio Técnico: Mini Kanban Fullstack com Autenticação

## 🎯 O Desafio
Construir uma aplicação funcional de gerenciamento de tarefas estilo Kanban, com autenticação segura, persistência de dados e uma interface moderna. O foco é demonstrar habilidades em arquitetura de software, segurança (JWT/Bcrypt) e integração entre frontend e backend.

---

## 🚀 Requisitos Técnicos (A "Receita")

### 1. Backend (O Cérebro)
*   **Framework:** NestJS (TypeScript).
*   **Banco de Dados:** PostgreSQL (Dockerizado).
*   **ORM:** Prisma.
*   **Autenticação:** 
    *   Passport-JWT para proteção de rotas.
    *   Bcrypt para hash de senhas (nunca salvar senhas em texto puro).
    *   Fluxo de "Esqueci minha senha" com envio de e-mail (simulado ou real).
*   **Arquitetura:** Modular (pastas separadas por recursos: Auth, Tasks, Users, Comments).

### 2. Frontend (A Face)
*   **Framework:** React 18 + Vite (TypeScript).
*   **Estilização:** Tailwind CSS (moderno e responsivo).
*   **Estado Global:** Hooks customizados (ex: `useAuth`).
*   **Comunicação:** Axios com interceptors para anexar o Token JWT automaticamente.
*   **UX:** Feedback visual com Toasts (Sonner) e Skeletons de carregamento.

### 3. Infraestrutura (A Casa)
*   **Docker:** `docker-compose.yml` orquestrando 3 serviços:
    1.  `db`: PostgreSQL.
    2.  `api`: Backend NestJS.
    3.  `web`: Frontend React (servido via Nginx em produção).

---

## 🛠️ Objetivos Funcionais (O que deve funcionar)

### A. Autenticação e Perfil
- [ ] **Cadastro e Login:** Fluxo completo com geração de Token JWT.
- [ ] **Esqueci a Senha:** Gerar token de redefinição e enviar por e-mail (logar no terminal se necessário).
- [ ] **Perfil do Usuário:** Permitir alteração de nome e exibição de avatar automático via **Gravatar**.
- [ ] **Tema:** Suporte a Dark Mode e Light Mode.

### B. Gestão de Tarefas (Kanban)
- [ ] **CRUD de Tasks:** Criar, editar, excluir e listar tarefas.
- [ ] **Colunas de Status:** Organizar em `TODO`, `DOING` e `DONE`.
- [ ] **Prioridades:** Marcar tarefas como `Baixa`, `Média` ou `Alta`.
- [ ] **Ordenação:** As tarefas devem manter sua posição na coluna.
- [ ] **Segurança de Dados:** Um usuário **nunca** deve conseguir ver ou editar as tarefas de outro (verificação de `ownership`).

### C. Comentários
- [ ] **Interação:** Permitir que o usuário adicione e remova comentários dentro de cada tarefa.

---

## 🔌 Contrato da API (Endpoints Esperados)

| Método | Rota | Descrição | Protegido? |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Cria um novo usuário | Não |
| **POST** | `/auth/login` | Autentica e retorna o Token | Não |
| **POST** | `/auth/forgot-password` | Inicia recuperação de senha | Não |
| **GET** | `/tasks` | Lista tarefas do usuário logado | **Sim** |
| **POST** | `/tasks` | Cria uma nova tarefa | **Sim** |
| **PATCH** | `/tasks/:id` | Atualiza dados/status da tarefa | **Sim** |
| **DELETE** | `/tasks/:id` | Remove a tarefa permanentemente | **Sim** |
| **GET** | `/users/me` | Retorna dados do perfil atual | **Sim** |

---

## 💡 Diferenciais (O que te destaca)
1.  **Clean Code:** Código bem indentado, sem arquivos comentados e com nomes de variáveis semânticos.
2.  **Tratamento de Erros:** Mensagens amigáveis para o usuário quando algo dá errado (ex: "Senha inválida" em vez de erro 500).
3.  **Responsividade:** O Kanban deve ser usável no celular e no desktop.
4.  **Organização de Pastas:** Seguir o padrão modular do NestJS e a separação de `components`, `pages` e `hooks` no React.

---
*Este desafio simula as demandas reais de uma vaga de Desenvolvedor Fullstack Junior/Pleno.*
