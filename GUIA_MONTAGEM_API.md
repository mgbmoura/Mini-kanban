#  Guia de Montagem da API: A Receita Comentada do Chef

Este guia é uma série de aulas práticas para construir a API do zero. Cada passo é uma lição detalhada que explica a lógica, os comandos e o resultado esperado, transformando a montagem em um processo de aprendizado.

---

## 🛠️ Passo 1 — Construindo a Cozinha (O Esqueleto NestJS)

Nesta primeira etapa, vamos usar a ferramenta de linha de comando (CLI) do NestJS para criar a estrutura básica do projeto. É como desenhar a planta baixa e erguer as paredes da nossa cozinha.

### Pseudocódigo (Lógica de Alto Nível)

```pseudocode
INÍCIO
    EXECUTAR o assistente da CLI do NestJS para criar um NOVO projeto.
    FORNECER o nome "api" para o novo projeto.
    AGUARDAR o assistente criar a estrutura de pastas e instalar as dependências.
    NAVEGAR para dentro do diretório "api" que foi criado.
FIM
```

### Comandos no Terminal (Código Real)

O "código" para esta etapa não é em uma linguagem de programação, mas sim comandos executados no seu terminal.

```bash
# 1. Executa a CLI do NestJS com o comando "new" para criar o projeto "api".
nest new api

# 2. Navega para dentro do diretório recém-criado.
cd api
```

### Explicação dos Comandos e Resultados (Linha por Linha)

-   `nest new api`
    -   `nest`: Invoca a CLI (Command Line Interface) do NestJS, nossa principal ferramenta de automação.
    -   `new`: É a instrução para criar uma nova aplicação do zero.
    -   `api`: É o nome que damos ao nosso projeto. A CLI criará uma pasta com este nome.
    -   **O que acontece?** A CLI executa uma série de tarefas:
        1.  Cria uma pasta chamada `api`.
        2.  Gera a estrutura de arquivos e pastas padrão do NestJS dentro dela (`src`, `test`, etc.).
        3.  Cria arquivos essenciais como `main.ts` (o ponto de entrada da aplicação), `app.module.ts` (o módulo raiz) e `package.json` (o gerenciador de dependências).
        4.  Instala as dependências básicas do Node.js para o NestJS funcionar.

-   `cd api`
    -   `cd`: É o comando universal de terminais para "Change Directory" (Mudar de Diretório).
    -   `api`: O nome da pasta para a qual queremos entrar.
    -   **O que acontece?** Seu terminal agora passa a operar de dentro da pasta do projeto. Todos os comandos seguintes serão executados a partir da raiz do projeto `api`.

---

## 🛠️ Passo 2 — Montando a Despensa (Prisma e Banco de Dados)

Com a cozinha montada, precisamos de uma despensa para guardar os ingredientes (o banco de dados PostgreSQL) e um livro de receitas para organizar tudo (o Prisma).

### Pseudocódigo (Lógica de Alto Nível)

```pseudocode
INÍCIO
    // Parte 1: Ferramentas
    ADICIONAR a ferramenta "Prisma" ao projeto.
    INICIALIZAR o Prisma para criar o arquivo de schema (o livro de receitas).
    
    // Parte 2: Receita
    DEFINIR no schema a fonte de dados (PostgreSQL).
    MODELAR as tabelas (User, Task, Comment) com seus campos e relações.
    
    // Parte 3: Ambiente
    CRIAR um arquivo de ambiente (.env) com o endereço do banco de dados.
    CRIAR um arquivo de orquestração (docker-compose.yml) para o banco de dados.
    
    // Parte 4: Construção
    INICIAR o serviço do banco de dados usando Docker.
    EXECUTAR o comando do Prisma para "migrar", que lê o schema e constrói as tabelas no banco.
FIM
```

### Comandos no Terminal (Código Real)

```bash
# --- Parte 1: Instalação das ferramentas --- 

# Instala a CLI do Prisma como uma dependência de desenvolvimento.
npm install prisma --save-dev

# Instala o Cliente Prisma, que usaremos no código para falar com o banco.
npm install @prisma/client

# Inicializa o Prisma, criando a pasta /prisma e o arquivo schema.prisma.
npx prisma init --datasource-provider postgresql


# --- Parte 2 e 3: Configuração dos arquivos (feito manualmente) ---
# Nesta etapa, você edita os arquivos schema.prisma, .env e docker-compose.yml
# (O conteúdo detalhado está na explicação abaixo)


# --- Parte 4: Construção do Banco de Dados --- 

# Sobe o contêiner do PostgreSQL definido no docker-compose.yml em modo "detached" (segundo plano).
docker-compose up -d

# Executa a migração do Prisma para criar as tabelas.
npx prisma migrate dev --name init
```

### Explicação Detalhada (Arquivo por Arquivo, Comando por Comando)

1.  **Instalação (`npm install ...`)**: Esses comandos adicionam as ferramentas do Prisma ao `package.json` e à pasta `node_modules`. O `--save-dev` significa que o `prisma` (a CLI) só é necessário para o ambiente de desenvolvimento, não para rodar a aplicação em produção.

2.  **`npx prisma init ...`**: Este comando cria a pasta `prisma` e, dentro dela, o arquivo `schema.prisma`. É a fundação da nossa configuração de banco de dados. Ele já vem pré-configurado para usar PostgreSQL, como instruímos.

3.  **Edição do `schema.prisma`**: Aqui você cola o modelo de dados que já estudamos, definindo as tabelas `User`, `Task` e `Comment`. **É o passo mais importante da modelagem.** (O conteúdo completo com as tabelas em Markdown está no arquivo `COMO_MONTAR_DO_ZERO.md`).

4.  **Criação do `docker-compose.yml`**: Este arquivo é uma "receita" para o Docker. Ele diz:
    -   `image: postgres:13`: Use a imagem oficial do PostgreSQL na versão 13.
    -   `environment`: Configure o banco com um usuário (`user`), senha (`password`) e um nome de banco de dados (`minikanban`).
    -   `ports: - '5432:5432'`: Mapeie a porta 5432 do contêiner para a porta 5432 da sua máquina, permitindo que a API se conecte a `localhost:5432`.

5.  **Criação do `.env`**: Este arquivo guarda segredos e configurações do ambiente.
    -   `DATABASE_URL=...`: Esta variável de ambiente fornece ao Prisma o "endereço" completo para ele encontrar e autenticar no banco de dados que o Docker está rodando.

6.  **`docker-compose up -d`**: Este comando lê o `docker-compose.yml` e executa suas instruções. O Docker baixa a imagem do PostgreSQL (se ainda não tiver) e inicia um contêiner com o banco de dados já configurado e rodando em segundo plano (por causa da flag `-d`).

7.  **`npx prisma migrate dev --name init`**: Este é o clímax da montagem do banco!
    -   `migrate dev`: É o comando para aplicar as mudanças do `schema.prisma` no ambiente de desenvolvimento.
    -   `--name init`: Dá um nome a essa "foto" inicial da estrutura do banco (a migração).
    -   **O que acontece?** O Prisma se conecta ao banco de dados no Docker, compara o `schema.prisma` com o estado atual do banco (que está vazio) e gera e executa o código SQL necessário para criar as tabelas `User`, `Task` e `Comment` exatamente como modelamos. Sua despensa está pronta!
