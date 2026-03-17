# 📋 Mini-Kanban Fullstack

O **Mini-Kanban** é uma plataforma profissional de gerenciamento de tarefas, construída com uma arquitetura moderna, escalável e segura. Este projeto demonstra competências em Desenvolvimento Fullstack, DevOps e Engenharia de Software.

## 🏗️ Arquitetura do Projeto

A estrutura foi organizada seguindo o padrão de **Separação de Responsabilidades (SoC)**, facilitando a manutenção e a colaboração:

### 📁 Root (Raiz)
Contém a orquestração de todo o ecossistema.
- `docker-compose.yml`: O "manual de montagem" que sobe o Banco de Dados (PostgreSQL), a API e o Web em segundos.
- `.dockerignore`: Otimiza o build, garantindo que apenas o necessário seja enviado aos containers.

### 📁 /api (O Cérebro)
Construído com **NestJS**, focado em regras de negócio e segurança.
- **`src/auth/`**: Autenticação robusta via JWT e fluxo de recuperação de senha com tokens hasheados.
- **`src/tasks/`**: Inteligência do quadro Kanban, com lógica de ordenação dinâmica.
- **`prisma/`**: Camada de persistência usando PostgreSQL, garantindo integridade dos dados.

### 📁 /web (A Face)
Interface reativa construída com **React**, **Tailwind CSS** e **Shadcn/UI**.
- **`src/components/`**: Biblioteca de componentes visuais reutilizáveis.
- **`src/services/`**: Camada de comunicação que consome a API de forma assíncrona.
- **`src/app/`**: Orquestração de páginas, rotas e experiência do usuário (UX).

## 🚀 Por que essa estrutura é boa?

1.  **Escalabilidade**: Você pode trocar o Frontend inteiro sem mexer em uma linha do Backend, e vice-versa.
2.  **Segurança**: Regras de acesso são aplicadas no servidor, protegendo os dados mesmo que o cliente seja violado.
3.  **Dockerização**: Garante que o projeto rode exatamente da mesma forma em qualquer computador ("Rodou na minha máquina, roda na sua!").

---
*Desenvolvido com foco em alta performance e boas práticas de engenharia.*
