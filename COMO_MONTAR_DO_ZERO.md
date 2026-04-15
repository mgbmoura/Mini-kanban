# 🎓 Aulas Práticas do Guia Mestre

Este documento é o seu curso prático para entender a construção desta aplicação do zero. Cada seção é uma aula focada em um pedaço da tecnologia.

---

## Aula 1: A Fundação - Construindo a Base de Dados com Prisma

Se o Backend é a cozinha, a Base de Dados (PostgreSQL) é a despensa onde guardamos os ingredientes. Mas como o Chef (NestJS) conversa com a despensa? Ele não fala "PostgreSQLês". Ele usa um tradutor: o **Prisma**.

**O que é o Prisma?**
Imagine o Prisma como um **Livro de Receitas Bilingue e Inteligente**.
- De um lado, as receitas estão escritas em uma linguagem fácil que o Chef entende (TypeScript).
- Do outro lado, as mesmas receitas estão na linguagem super complexa que os estoquistas da despensa entendem (SQL).

O Prisma faz essa tradução automaticamente. O nosso único trabalho é manter o livro de receitas atualizado. Esse livro é o arquivo `api/prisma/schema.prisma`.

### O `schema.prisma`: A Ficha Técnica dos Ingredientes

Este arquivo é a fonte da verdade para o nosso banco de dados. Ele é o mapa que descreve cada prateleira e cada ingrediente da nossa despensa.

#### **Lógica em "Portugol"**
Vamos traduzir o `schema.prisma` para um Português estruturado:

```portugol
// CONFIGURAÇÕES GERAIS
// --------------------
// Defina o tipo do banco de dados (nossa "despensa") e onde ela está.
FONTE_DE_DADOS db:
  provedor = "postgresql"
  url      = "pegar do arquivo de segredos" // (env("DATABASE_URL"))

// Defina qual tipo de cliente vai usar o Prisma.
GERADOR cliente:
  provedor = "prisma-client-js" // Gera um cliente em JavaScript/TypeScript

// TIPOS DE DADOS CUSTOMIZADOS
// --------------------
// Um tipo "Status da Tarefa" que só pode ter 3 valores definidos.
TIPO TaskStatus:
  TODO, DOING, DONE

// NOSSAS TABELAS (PRATELEIRAS)
// --------------------

// Tabela de Usuários
MODELO User:
  id: Texto, é a chave principal, gerada automaticamente.
  email: Texto, é único (não pode ter dois usuários com mesmo email).
  name: Texto.
  password: Texto (o hash, não a senha real!).
  // RELACIONAMENTOS:
  tasks: É uma LISTA de Tarefas (conexão com o modelo Task).
  comments: É uma LISTA de Comentários.

// Tabela de Tarefas
MODELO Task:
  id: Texto, chave principal.
  title: Texto, obrigatório.
  description: Texto, opcional.
  status: Do tipo TaskStatus, com valor padrão "TODO".
  // RELACIONAMENTOS:
  userId: Texto (Guarda o ID do dono da tarefa).
  user: É uma conexão única com o MODELO User. A conexão usa o campo `userId` daqui e aponta para o campo `id` do User.

// Tabela de Comentários
MODELO Comment:
  id: Texto, chave principal.
  content: Texto.
  // RELACIONAMENTOS:
  taskId: Texto (Guarda o ID da tarefa onde o comentário foi feito).
  task: Conexão com o MODELO Task. Se uma tarefa for deletada, todos os seus comentários também são (onDelete: Cascade).
  userId: Texto (Guarda o ID de quem fez o comentário).
  user: Conexão com o MODELO User.
```

#### **Código Real Comentado**
Agora, o código real do `schema.prisma`, que você pode encontrar em `api/prisma/schema.prisma`.

```prisma
// api/prisma/schema.prisma

// BLOCO 1: CONFIGURAÇÕES
// =======================

// Gera o cliente Prisma (o conjunto de funções que usamos no nosso código)
generator client {
  provider = "prisma-client-js"
}

// Define a conexão com o banco de dados.
datasource db {
  provider = "postgresql" // Estamos usando PostgreSQL
  url      = env("DATABASE_URL") // A URL de conexão está em uma variável de ambiente por segurança
}


// BLOCO 2: ENUM - UM TIPO CUSTOMIZADO
// ==================================
// Criamos um "tipo" especial para o status, garantindo que só
// estes 3 valores possam ser usados no campo 'status' da tarefa.
enum TaskStatus {
  TODO
  DOING
  DONE
}


// BLOCO 3: MODELS - AS TABELAS DO BANCO
// =====================================

// MODELO USER (Tabela de Usuários)
// -------------------------------
model User {
  id        String    @id @default(uuid()) // @id: Chave primária. @default(uuid()): Gera um ID único universal.
  email     String    @unique // @unique: Garante que não haja emails repetidos no banco.
  name      String
  password  String
  
  // RELACIONAMENTOS:
  // tasks e comments são campos "virtuais". Eles não existem no banco de dados,
  // mas servem para o Prisma entender a conexão e nos ajudar a fazer buscas.
  // Ex: prisma.user.findUnique({ where: { id }, include: { tasks: true } })
  tasks     Task[]    @relation("UserTasks")
  comments  Comment[]
}

// MODELO TASK (Tabela de Tarefas)
// -------------------------------
model Task {
  id              String    @id @default(uuid())
  title           String
  description     String?   // O '?' torna o campo opcional (pode ser nulo).
  status          TaskStatus @default(TODO) // Usa nosso Enum e define um valor padrão.
  
  // RELACIONAMENTOS:
  userId          String    // Chave estrangeira: Este campo realmente existe na tabela.
  // @relation: Define a conexão.
  // "UserTasks": Um nome para a relação (opcional, mas bom para clareza).
  // fields: [userId]: Diz qual campo desta tabela (Task) guarda a chave estrangeira.
  // references: [id]: Diz a qual campo da outra tabela (User) a chave estrangeira se refere.
  user            User      @relation("UserTasks", fields: [userId], references: [id])
  
  comments        Comment[] // Campo virtual para o Prisma navegar de Task para Comment.
}

// MODELO COMMENT (Tabela de Comentários)
// ------------------------------------
model Comment {
  id        String   @id @default(uuid())
  content   String
  
  // RELACIONAMENTO 1: Comentário pertence a uma Tarefa
  taskId    String
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  // onDelete: Cascade: Regra de ouro. Se uma Tarefa for deletada, o Prisma
  // automaticamente deleta todos os comentários associados a ela. Mágico!

  // RELACIONAMENTO 2: Comentário pertence a um Usuário
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

### O Passo Final: `prisma migrate`

Depois de escrever esse belo mapa, como construímos a despensa (o banco de dados) de verdade? Com um único comando no terminal:

`npx prisma migrate dev --name init`

Este comando lê o seu `schema.prisma` e:
1.  Gera o código SQL necessário para criar as tabelas `User`, `Task`, e `Comment`.
2.  Executa esse código no seu banco de dados PostgreSQL.
3.  Salva uma "foto" (uma migração) da estrutura do seu banco, para que ele saiba o que mudou da próxima vez.

**Parabéns!** Você concluiu a Aula 1. Agora você entende a fundação do nosso sistema: como os dados são estruturados e relacionados. Na próxima aula, veremos como o `Backend` (o Chef) usa o `Prisma Client` para manipular esses dados.

---

## Aula 2: O Chef em Ação - Manipulando Dados com Prisma Client

Na Aula 1, desenhamos o mapa (`schema.prisma`). Ao rodar o comando `prisma migrate`, o Prisma não só construiu a "despensa" (banco de dados), mas também nos deu uma **"Comanda Eletrônica"** super moderna. Essa comanda é o `Prisma Client`.

**O que é o Prisma Client?**
É um conjunto de funções e objetos TypeScript gerado AUTOMATICAMENTE a partir do seu `schema.prisma`. Ele é feito sob medida para a sua aplicação.

Se você definiu um `model Task`, o Prisma Client te dará `prisma.task`, com funções como `create`, `findMany`, `update`, `delete`, etc.

**Como o Chef (`TasksService`) pega essa comanda?**
Ele não cria uma nova toda vez. Em NestJS, por uma questão de eficiência, criamos um serviço central (`PrismaService`) que segura essa comanda para quem precisar. 

No nosso `TasksService`, simplesmente pedimos: "NestJS, me dê acesso à comanda que o `PrismaService` está segurando". É isso que acontece no `constructor`:
`constructor(private prisma: PrismaService) {}`

Agora vamos ver o Chef usando a comanda na prática dentro do `api/src/tasks/tasks.service.ts`.

### As 4 Operações Fundamentais (CRUD)

#### 1. CREATE (Criar)

**Lógica em "Portugol"**
```portugol
FUNÇÃO criar_tarefa (dados_da_tarefa, id_do_usuario):
  // Chef, pegue a comanda eletrônica e vá para a seção de "Task".
  // Use a função "create" e passe os seguintes dados:
  RETORNE comanda.tarefa.criar({
    dados: {
      ...dados_da_tarefa, // título, descrição, etc.
      conectar_com_usuario_de_id: id_do_usuario
    }
  })
```

**Código Real**
```typescript
// Já vimos este na aula anterior, mas agora com o novo contexto.
async create(data: CreateTaskDto, userId: string) {
  return this.prisma.task.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}
```

#### 2. READ (Ler)

**Lógica em "Portugol"**
```portugol
FUNÇÃO encontrar_todas_as_tarefas (id_do_usuario):
  // Chef, na seção "Task" da comanda, use a função "findMany" (encontrar vários).
  // Mas atenção: só me traga as tarefas ONDE a coluna "userId" for igual ao "id_do_usuario" que pediu.
  // E traga a contagem de comentários junto!
  RETORNE comanda.tarefa.encontrarVarios({
    onde: { userId: é_igual_a(id_do_usuario) },
    incluir: { contagem_de_comentarios: verdadeiro }
  })
```

**Código Real**
```typescript
async findAll(userId: string) {
  return this.prisma.task.findMany({
    where: { userId }, // A cláusula 'where' faz a mágica da segurança!
    include: {
      _count: { select: { comments: true } }, // Inclui a contagem de comentários
    },
    orderBy: { position: 'asc' }, // Ordena as tarefas pela posição
  });
}
```

#### 3. UPDATE (Atualizar)

**Lógica em "Portugol"**
```portugol
FUNÇÃO atualizar_tarefa (id_da_tarefa, id_do_usuario, novos_dados):
  // 1. CHECAR SEGURANÇA: O Chef primeiro verifica se a tarefa existe.
  tarefa_existente = comanda.tarefa.encontrarUnico({ onde: {id: id_da_tarefa} })
  SE tarefa_existente NÃO EXISTE, lance um erro "Tarefa não encontrada".
  
  // 2. CHECAR PERMISSÃO: O Chef verifica se o dono da tarefa é o mesmo que pediu pra atualizar.
  SE tarefa_existente.userId NÃO É IGUAL a id_do_usuario, lance um erro "Você não tem permissão".

  // 3. ATUALIZAR: Se passou nas checagens, agora sim, atualize!
  RETORNE comanda.tarefa.atualizar({
    onde: { id: id_da_tarefa },
    dados: novos_dados
  })
```

**Código Real**
```typescript
async update(id: string, userId: string, data: UpdateTaskDto) {
  const task = await this.prisma.task.findUnique({ where: { id } });

  if (!task) throw new NotFoundException('Tarefa não encontrada');

  // A regra de negócio mais importante! Garante que um usuário não edite a tarefa de outro.
  if (task.userId !== userId) throw new UnauthorizedException('Você não tem permissão para editar esta tarefa');

  return this.prisma.task.update({ where: { id }, data });
}
```

#### 4. DELETE (Deletar)

**Lógica em "Portugol"**
```portugol
FUNÇÃO remover_tarefa (id_da_tarefa, id_do_usuario):
  // Mesma lógica de segurança do UPDATE.
  tarefa_existente = comanda.tarefa.encontrarUnico({ onde: {id: id_da_tarefa} })
  SE tarefa_existente NÃO EXISTE, erro.
  SE tarefa_existente.userId NÃO É IGUAL a id_do_usuario, erro de permissão.

  // Se tudo estiver OK, delete.
  RETORNE comanda.tarefa.deletar({ onde: {id: id_da_tarefa} })
```

**Código Real**
```typescript
async remove(id: string, userId: string) {
  const task = await this.prisma.task.findUnique({ where: { id } });

  if (!task) throw new NotFoundException('Tarefa não encontrada');

  if (task.userId !== userId) throw new UnauthorizedException('Permissão negada');

  return this.prisma.task.delete({ where: { id } });
}
```

**Parabéns!** Você concluiu a Aula 2. Agora você sabe não apenas como os dados são estruturados, mas também como o nosso backend os manipula de forma segura e eficiente. Você entende como as regras de negócio (como a verificação de permissão) são implementadas no `Service` antes de qualquer ação no banco de dados.

---

## Aula 3: A Arquitetura da Cozinha - Estruturando a API com NestJS

Já temos nossa "despensa" (`PostgreSQL + Prisma`). Agora, vamos organizar a "cozinha" (`Backend API`). Por que usamos **NestJS** e não apenas Node.js puro com Express?

**Por que NestJS? (A Decisão de Ter um Chef Organizador)**

Imagine tentar cozinhar numa cozinha vazia, sem bancadas, pias ou prateleiras. Você conseguiria, mas seria um caos. Usar Node.js puro é assim. Você tem total liberdade, mas também a responsabilidade de montar tudo do zero.

**NestJS** é como comprar uma cozinha profissional pré-montada. Ela já vem com:
*   **Bancadas e Setores (Módulos):** Um lugar para carnes, um para saladas, etc.
*   **Hierarquia Clara (Controllers, Services):** O Garçom sabe com qual Chef falar.
*   **Ferramentas Inclusas (Injeção de Dependência, Validação):** Facas, panelas e um sistema de pedidos integrado.

NestJS nos força a seguir boas práticas de arquitetura, tornando o código mais limpo, organizado, testável e escalável.

### A Peça Central: Módulos (`@Module`)

A organização da nossa cozinha é feita em **Módulos**. Pense neles como "praças" ou "setores" de um restaurante. Temos a praça das tarefas (`TasksModule`), a praça dos usuários (`UsersModule`), a segurança (`AuthModule`), etc.

Cada módulo é uma caixa que agrupa tudo o que se refere a um mesmo assunto.

**Lógica em "Portugol" do `TasksModule`**
```portugol
// Este é o arquivo de registro do setor de Tarefas
DEFINIÇÃO DO MÓDULO DE TAREFAS:
  // Quem neste setor pode falar com o cliente?
  CONTROLADORES: [
    O Porteiro/Garçom de Tarefas (TasksController)
  ],
  // Quem neste setor trabalha na cozinha?
  PROVEDORES_DE_SERVIÇO: [
    O Chef de Tarefas (TasksService)
  ]
```

**Código Real Comentado (`tasks.module.ts`)**
```typescript
// api/src/tasks/tasks.module.ts

import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

// O @Module() é o decorador que transforma uma classe simples em um Módulo do NestJS.
@Module({
  // 'controllers': Lista todos os 'Porteiros' deste módulo.
  // São eles que definem as rotas HTTP (/tasks, /tasks/:id).
  controllers: [TasksController],

  // 'providers': Lista todos os 'Chefs' e 'Ajudantes' deste módulo.
  // O TasksService, que contém a lógica de negócio, é o nosso principal provider aqui.
  providers: [TasksService],
})
export class TasksModule {}
```
Este módulo `TasksModule` é depois importado no `app.module.ts`, que é o módulo principal que agrega todos os outros setores.

### O Superpoder: Injeção de Dependência

Este é o conceito mais importante do NestJS.

**O Problema:** O `TasksController` (Porteiro) precisa falar com o `TasksService` (Chef). Como ele o encontra?

**A Solução Ruim (sem NestJS):** O Porteiro teria que ele mesmo "criar" o seu Chef:
`const meuChef = new TasksService()`
Isso é ruim porque acopla as duas classes e dificulta os testes.

**A Solução Genial do NestJS (Injeção de Dependência):**
O Porteiro simplesmente declara na sua porta de entrada (o `constructor`) que ele **precisa** de um Chef.

`constructor(private tasksService: TasksService) {}`

É só isso! O NestJS, como um "Gerente Geral" da cozinha, vê essa declaração e automaticamente:
1.  Cria uma instância única do `TasksService`.
2.  "Injeta" ou "entrega" essa instância para o `TasksController`.

Isso torna tudo desacoplado e fácil de testar. Eu posso testar o `TasksController` e entregar a ele uma versão "fake" do `TasksService` se eu quiser.

### O Interruptor Geral (`main.ts`)

Se os módulos são os setores e o `AppModule` é a planta baixa da cozinha, o `main.ts` é o **disjuntor principal** que liga a energia de tudo.

**Lógica em "Portugol"**
```portugol
FUNÇÃO bootstrap (Ligar a API):
  // 1. Crie uma instância da nossa aplicação, usando a planta baixa principal (AppModule).
  app = FabricadeNest.criar(AppModule)

  // 2. CONFIGURAÇÕES EXTRAS:
  // Habilite o CORS (para o Frontend poder conversar com a API).
  // Defina um prefixo global, todos os endpoints começarão com /api.
  // Use um 'cano' de validação global para proteger todas as rotas.
  app.habilitarCors()
  app.usarPrefixoGlobal('api')
  app.usarPipeGlobalDeValidacao()

  // 3. Crie a documentação automática da API (Swagger).

  // 4. Ligue o servidor e comece a ouvir por requisições na porta 3000.
  AGUARDE app.ouvir(3000)
```

**Código Real Comentado (`main.ts`)**
```typescript
// api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Cria a aplicação NestJS a partir do nosso módulo raiz (AppModule).
  const app = await NestFactory.create(AppModule);

  // Permite que requisições de outras origens (como o nosso frontend em localhost:5173) cheguem à API.
  app.enableCors();
  
  // Faz com que todas as rotas tenham o prefixo /api.
  // Ex: '/tasks' no controller vira '/api/tasks'.
  app.setGlobalPrefix('api');

  // Instala um 'validador' em todas as rotas. Se um dado chegar com formato errado,
  // a requisição é bloqueada antes mesmo de chegar no nosso código.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configura o Swagger, que gera uma página web com a documentação de toda a API.
  const config = new DocumentBuilder()
    .setTitle('Mini Kanban API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Acesse em http://localhost:3000/api/docs

  // Inicia o servidor, que fica ouvindo por requisições na porta 3000.
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
```

**Parabéns!** Você concluiu a Aula 3. Agora você entende a estrutura de alto nível da nossa API, o porquê de usarmos NestJS e como suas peças principais (`Module`, `Controller`, `Service` e `main.ts`) se encaixam para formar a nossa "cozinha".

---

## Aula 4: O Segurança da Boate - Autenticação com JWT

Bem-vindo à Aula 4. Vamos falar sobre a parte mais crítica de qualquer aplicação: segurança. Como garantimos que um usuário só possa ver e editar as SUAS próprias tarefas? 

**A Analogia: A Boate VIP**
-   **API:** É a boate.
-   **Endpoints (`/tasks`, `/users`):** São as áreas da boate. Algumas são públicas (a entrada), outras são VIP (a área de tarefas).
-   **Login (`POST /auth/login`):** É a portaria principal. Você mostra sua identidade (email/senha). Se for válida, você ganha um **crachá VIP**.
-   **JWT (JSON Web Token):** É o seu **crachá VIP**. Ele é único, intransferível e tem data de validade.
-   **Guards (`JwtAuthGuard`):** São os seguranças na porta da área VIP. Eles não te deixam entrar sem mostrar um crachá válido.
-   **Request Header (`Authorization: Bearer ...`):** É o ato de mostrar seu crachá para o segurança.

### Parte 1: A Senha e o "Embaralhador" (Bcrypt)

Primeiro, uma regra de ouro: **NUNCA, JAMAIS, EM HIPÓTESE ALGUMA, guarde senhas em texto puro no banco de dados.**

Quando um usuário se cadastra, não guardamos `"123456"`. Nós usamos uma biblioteca chamada `bcrypt` para transformar essa senha em algo como `"$2b$10$QK..."`. Isso é um **hash**. 

O importante é que essa operação é uma via de mão única. É impossível pegar o hash e descobrir a senha original. Então, como validamos o login?

### Parte 2: O Login e a Criação do Crachá VIP (JWT)

Vamos olhar o `auth.service.ts` para entender o processo de login.

**Lógica em "Portugol"**
```portugol
FUNÇÃO login(email, senha_pura):
  // 1. Encontre o usuário pelo email.
  usuario = buscar_usuario_por_email(email)

  // 2. Se o usuário existir, compare a senha.
  //    O bcrypt vai "hashear" a senha_pura e comparar com o hash que está no banco.
  SE usuario EXISTE E bcrypt.comparar(senha_pura, usuario.senha_hash) É VERDADEIRO:
    
    // 3. A identidade é válida! Crie os dados para o crachá.
    dados_do_cracha = { id: usuario.id, email: usuario.email, nome: usuario.name }
    
    // 4. Gere o crachá (token JWT) usando os dados e a nossa chave secreta.
    cracha_vip = jwt.assinar(dados_do_cracha)
    RETORNE o cracha_vip e os dados do usuário.

  // 5. Se a comparação falhar, lance um erro de "Credenciais inválidas".
  SENÃO, lance um erro.
```

**Código Real Comentado (`auth.service.ts`)**
```typescript
async login(data: LoginDto) {
  const user = await this.usersService.findByEmail(data.email);

  // A mágica do bcrypt acontece aqui! Compara a senha enviada com a do banco.
  if (user && (await bcrypt.compare(data.password, user.password))) {
    
    // Payload: A "carga útil" de informações que queremos guardar dentro do token.
    const payload = { sub: user.id, email: user.email, name: user.name };
    
    // this.jwtService.sign: Gera o token JWT, assinando o payload com nosso segredo.
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
  throw new UnauthorizedException('Credenciais inválidas');
}
```

### Parte 3: O Segurança na Porta (`@UseGuards` e `JwtAuthGuard`)

Ok, o usuário tem um crachá. Como o usamos? Nos `controllers`, nós colocamos um "segurança" na porta dos endpoints que queremos proteger.

```typescript
// Em um controller como o tasks.controller.ts

// Este decorador posiciona o segurança na porta de TODOS os endpoints abaixo dele.
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {

  // Agora, para entrar neste endpoint de criar tarefa, o usuário DEVE
  // apresentar um JWT válido no header "Authorization".
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user.id);
  }
}
```
O `JwtAuthGuard` é uma classe bem simples que apenas diz: "Use a estratégia de autenticação chamada 'jwt'". Mas quem define essa estratégia?

### Parte 4: O Manual de Validação do Crachá (`JwtStrategy`)

Este é o cérebro da validação. É o "manual" que o segurança (`JwtAuthGuard`) usa para saber se um crachá é autêntico.

**Código Real Comentado (`api/src/auth/jwt.strategy.ts`)**
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // 1. Onde procurar o crachá? No cabeçalho de autorização como um "Bearer Token".
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // 2. Não ignore a data de validade. Se o crachá expirou, é inválido.
      ignoreExpiration: false,

      // 3. A CHAVE SECRETA. Usamos a mesma chave do .env para verificar a assinatura.
      //    Se o token foi alterado ou assinado com outra chave, a validação falha AQUI.
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // Se a assinatura do token for válida, o NestJS chama este método automaticamente.
  async validate(payload: any) {
    // O `payload` são os dados que colocamos no crachá lá no login.
    // O que retornamos aqui será o objeto `user` injetado na requisição.
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
```

E é assim que o ciclo se fecha! 
1.  O `login` cria um JWT assinado.
2.  O Frontend envia esse JWT no Header `Authorization` de cada requisição.
3.  O `JwtAuthGuard` intercepta a requisição e usa a `JwtStrategy`.
4.  A `JwtStrategy` valida a assinatura do JWT com a chave secreta.
5.  Se for válido, o método `validate` retorna os dados do usuário.
6.  O NestJS anexa esses dados à requisição, e o `Controller` pode usá-los, sabendo com 100% de certeza quem é o usuário logado.

**Parabéns!** Você concluiu a Aula 4. A segurança da API não é mais um mistério. Você entende o fluxo completo de autenticação e autorização, o pilar que permite que nosso app seja multi-usuário de forma segura.