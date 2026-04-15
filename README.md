# Projeto Fullstack Mini Kanban 

Este projeto é uma aplicação full-stack completa que implementa um quadro Kanban interativo com autenticação de usuários, construído com foco em boas práticas de arquitetura, segurança e uma excelente experiência de desenvolvimento.

---

## 🚀 Funcionalidades Principais

*   **Autenticação de Usuários:** Cadastro e Login seguros com JSON Web Tokens (JWT).
*   **Gerenciamento de Tarefas (CRUD):** Usuários autenticados podem criar, listar, atualizar e excluir suas próprias tarefas.
*   **Quadro Kanban Interativo:** Interface com colunas de status (TODO, DOING, DONE) e funcionalidade de arrastar e soltar (drag-and-drop) para alterar o status das tarefas.
*   **Segurança de ponta a ponta:** Senhas criptografadas com `bcrypt` e uma camada de serviço que garante que um usuário **jamais** acesse os dados de outro.
*   **Documentação de API:** Interface Swagger gerada automaticamente para explorar e testar os endpoints do backend.

---

## 🛠️ Tecnologias Utilizadas

| Área         | Tecnologia                                      |
|--------------|-------------------------------------------------|
| **Backend**  | NestJS, TypeScript, Prisma, PostgreSQL, Passport.js (JWT) |
| **Frontend** | React, Vite, TypeScript, TailwindCSS, React-Router    |
| **Banco de Dados** | PostgreSQL                                      |
| **DevOps**   | Docker, Docker Compose                          |

---

## ⚡ Como Executar o Projeto

Este projeto é 100% containerizado, garantindo que ele funcione de forma idêntica em qualquer ambiente.

**Pré-requisitos:**
*   [Docker](https://www.docker.com/get-started)
*   [Docker Compose](https://docs.docker.com/compose/install/)

**Passo a passo:**
1.  Clone este repositório:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    ```
2.  Navegue até a raiz do projeto e execute o Docker Compose:
    ```bash
    cd <NOME_DA_PASTA>
    docker-compose up -d
    ```
3.  É isso! A aplicação estará disponível nos seguintes endereços:
    *   **Frontend (React):** `http://localhost:5173`
    *   **Backend (NestJS):** `http://localhost:3000`
    *   **Documentação da API (Swagger):** `http://localhost:3000/api/docs`

---

## 🏗️ Destaques de Arquitetura e Segurança

*   **Monorepo com Separação de Responsabilidades (SoC):** O código do frontend (`/web`) e do backend (`/api`) vivem no mesmo repositório, mas são completamente desacoplados, permitindo desenvolvimento e deploy independentes.
*   **Backend Modular:** O NestJS foi estruturado em módulos (`Auth`, `Users`, `Tasks`), onde cada um tem sua responsabilidade bem definida (Controllers para rotas, Services para regras de negócio).
*   **Segurança por "Ownership":** A camada de serviço do backend verifica sistematicamente a propriedade dos dados em cada requisição, garantindo que um usuário só possa manipular as tarefas que lhe pertencem.
*   **Ambiente de Desenvolvimento Automatizado:** O `docker-compose` não apenas sobe os serviços, mas o container da API executa as migrações do Prisma (`prisma migrate deploy`) automaticamente no startup, eliminando qualquer passo manual de configuração do banco de dados.

---
*Desenvolvido com foco em alta performance e boas práticas de engenharia.*
