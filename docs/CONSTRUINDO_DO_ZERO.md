# Construindo o Mini Kanban do Zero

> Um guia prático para entender, reconstruir e defender o projeto em uma entrevista.

Este documento ensina a construir uma aplicação semelhante ao Mini Kanban atual, começando pelo problema e adicionando cada parte somente quando surge uma necessidade concreta.

Ele **não representa a ordem histórica exata dos commits do repositório**. A proposta é didática: reconstruir o sistema de um jeito progressivo, simples de acompanhar e fácil de explicar.

A ideia central é:

```text
problema
   ↓
solução mínima
   ↓
implementar
   ↓
testar
   ↓
identificar a próxima necessidade
```

Não começaremos escolhendo padrões arquiteturais. Primeiro construiremos funcionalidades. As abstrações aparecem somente quando resolvem um problema real.

---

## Sumário

1. [O problema que vamos resolver](#1-o-problema-que-vamos-resolver)
2. [A arquitetura final, sem começar por ela](#2-a-arquitetura-final-sem-começar-por-ela)
3. [Preparando o projeto](#3-preparando-o-projeto)
4. [Criando o backend NestJS](#4-criando-o-backend-nestjs)
5. [PostgreSQL e Prisma](#5-postgresql-e-prisma)
6. [Primeira entidade: usuário](#6-primeira-entidade-usuário)
7. [Cadastro e proteção da senha](#7-cadastro-e-proteção-da-senha)
8. [Login e JWT](#8-login-e-jwt)
9. [Protegendo rotas com JWT](#9-protegendo-rotas-com-jwt)
10. [Perfil do usuário](#10-perfil-do-usuário)
11. [Criando o domínio de tarefas](#11-criando-o-domínio-de-tarefas)
12. [Garantindo que cada usuário acesse apenas suas tarefas](#12-garantindo-que-cada-usuário-acesse-apenas-suas-tarefas)
13. [Criando o frontend React](#13-criando-o-frontend-react)
14. [Axios e autenticação no frontend](#14-axios-e-autenticação-no-frontend)
15. [Contexto de autenticação e rotas privadas](#15-contexto-de-autenticação-e-rotas-privadas)
16. [Integração das tarefas com a API](#16-integração-das-tarefas-com-a-api)
17. [Montando o quadro Kanban](#17-montando-o-quadro-kanban)
18. [Drag and drop](#18-drag-and-drop)
19. [Ordenação por posição](#19-ordenação-por-posição)
20. [Atualização otimista](#20-atualização-otimista)
21. [Comentários](#21-comentários)
22. [Tema e configurações](#22-tema-e-configurações)
23. [Recuperação de senha](#23-recuperação-de-senha)
24. [Validação, Swagger e tratamento de erros](#24-validação-swagger-e-tratamento-de-erros)
25. [Docker, Nginx e PostgreSQL](#25-docker-nginx-e-postgresql)
26. [Testes e validação](#26-testes-e-validação)
27. [Fluxos completos da aplicação](#27-fluxos-completos-da-aplicação)
28. [Decisões que você deve conseguir defender](#28-decisões-que-você-deve-conseguir-defender)
29. [O que não colocamos de propósito](#29-o-que-não-colocamos-de-propósito)
30. [Desafio: reconstruir sem olhar o código](#30-desafio-reconstruir-sem-olhar-o-código)
31. [Checklist final de estudo](#31-checklist-final-de-estudo)

---

# 1. O problema que vamos resolver

Queremos uma aplicação em que uma pessoa possa:

- criar uma conta;
- entrar com e-mail e senha;
- visualizar apenas suas próprias tarefas;
- organizar tarefas em três colunas;
- criar, editar e excluir tarefas;
- mover cartões entre colunas;
- reordenar cartões;
- comentar nas próprias tarefas;
- editar o nome do perfil;
- usar tema claro ou escuro;
- recuperar a senha por e-mail.

No início, não precisamos pensar em `Controller`, `Context`, `Guard`, `DTO`, `PrismaService` ou qualquer outro nome técnico.

O problema inicial pode ser resumido assim:

```text
Usuário
  ↓
cria uma conta
  ↓
entra no sistema
  ↓
gerencia suas próprias tarefas
```

Essa é a base de todas as decisões seguintes.

## Primeira pergunta de arquitetura

Precisamos persistir usuários e tarefas. Portanto, precisamos de um banco.

Precisamos de uma interface no navegador. Portanto, precisamos de um frontend.

Precisamos impedir que o navegador fale diretamente com o banco. Portanto, precisamos de um backend.

Isso já nos leva a:

```text
React
  ↓ HTTP
Backend
  ↓
PostgreSQL
```

Nada além disso é necessário neste momento.

### Você deve conseguir explicar

- qual problema o Mini Kanban resolve;
- por que existe backend;
- por que o frontend não acessa o PostgreSQL diretamente;
- por que usuários e tarefas precisam ser persistidos.

---

# 2. A arquitetura final, sem começar por ela

No estado atual, a aplicação ficou aproximadamente assim:

```text
NAVEGADOR
   │
   ▼
React + TypeScript
   │
   ▼
Axios
   │
   ▼
Nginx /api
   │
   ▼
NestJS
   │
   ▼
Service
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

Isso **não significa** que devemos criar todas essas peças antes de fazer a primeira funcionalidade.

Cada uma precisa responder a uma pergunta:

| Peça | Por que existe? |
| --- | --- |
| React | construir a interface e gerenciar estado visual |
| Axios | centralizar chamadas HTTP |
| Context | compartilhar autenticação entre telas |
| NestJS | expor API e organizar regras do backend |
| Service | concentrar regras de uma funcionalidade |
| Prisma | consultar e alterar o banco com tipagem |
| PostgreSQL | persistir dados |
| JWT | identificar o usuário em requisições protegidas |
| Nginx | servir o frontend e encaminhar `/api` ao backend |
| Docker | reproduzir o ambiente com menos configuração manual |

Se uma peça não tiver uma resposta simples, devemos questionar se ela realmente precisa existir.

---

# 3. Preparando o projeto

Uma forma simples de começar é manter backend e frontend no mesmo repositório:

```text
mini-kanban/
├── api/
├── web/
└── package.json
```

O projeto atual usa workspaces npm:

```json
{
  "private": true,
  "workspaces": ["api", "web"]
}
```

Isso permite instalar dependências pela raiz e manter dois projetos independentes dentro do mesmo repositório.

## Criando a raiz

```bash
mkdir mini-kanban
cd mini-kanban
npm init -y
```

No `package.json` da raiz podemos adicionar:

```json
{
  "private": true,
  "workspaces": ["api", "web"]
}
```

Depois construiremos cada aplicação separadamente.

### Por que monorepo?

Não porque monorepo é sempre melhor.

Neste projeto ele é conveniente porque frontend e backend pertencem ao mesmo produto e serão executados juntos.

Não precisamos de ferramentas como Nx ou Turborepo para isso. O workspace simples do npm atende o tamanho do projeto.

### Checkpoint

```text
✓ repositório criado
✓ pasta api
✓ pasta web
✗ banco
✗ usuários
✗ autenticação
✗ tarefas
```

---

# 4. Criando o backend NestJS

Podemos gerar uma aplicação NestJS dentro de `api`.

Uma forma comum:

```bash
npx @nestjs/cli new api
```

O Nest cria uma estrutura inicial com módulo, controller e service.

Nosso objetivo inicial não é criar todos os módulos do projeto. Primeiro queremos apenas verificar se a API sobe.

O ponto de entrada atual está em:

```text
api/src/main.ts
```

Uma versão mínima seria:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function iniciarAplicacao() {
  const aplicativo = await NestFactory.create(AppModule);
  await aplicativo.listen(3000);
}

iniciarAplicacao();
```

Execute:

```bash
cd api
npm run start:dev
```

Se o Nest subir, temos o primeiro pedaço funcionando.

## O que é o AppModule?

O `AppModule` é o módulo raiz da aplicação NestJS.

Pense nele como o ponto que reúne os módulos principais:

```text
AppModule
├── AutenticacaoModule
├── UsuariosModule
├── TarefasModule
├── ComentariosModule
└── EmailModule
```

No começo, ele não precisa ter tudo isso.

### Você deve conseguir explicar

- o que é o NestJS;
- o que é um módulo no Nest;
- qual a função de `main.ts`;
- por que começamos com uma API mínima.

---

# 5. PostgreSQL e Prisma

Agora surge a primeira necessidade real de persistência.

Queremos que usuários continuem existindo depois que a API reiniciar.

Portanto:

```text
API
 ↓
PostgreSQL
```

O projeto usa Prisma como ORM.

## Por que Prisma?

Sem Prisma, poderíamos escrever SQL diretamente.

Isso funcionaria, mas teríamos que cuidar manualmente de:

- conexão;
- consultas;
- parâmetros;
- conversão dos resultados;
- tipagem no TypeScript.

O Prisma resolve essas tarefas e mantém o acesso ao banco explícito.

## Instalando

```bash
cd api
npm install @prisma/client
npm install -D prisma
npx prisma init
```

Isso cria:

```text
api/prisma/schema.prisma
```

## Configurando PostgreSQL

No `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kanban?schema=public"
```

No schema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## PrismaService

Em NestJS é útil encapsular o `PrismaClient` em um provider para que Services possam recebê-lo por injeção de dependência.

Fluxo:

```text
TarefasService
     ↓
PrismaService
     ↓
PrismaClient
     ↓
PostgreSQL
```

Essa camada possui responsabilidade concreta: integrar o ciclo de vida do Prisma ao Nest.

### Por que não criar um Repository manual agora?

Porque o Prisma já é a interface de acesso ao banco.

Se criássemos:

```text
Service
  ↓
Repository
  ↓
PrismaService
```

mas o Repository apenas executasse `prisma.task.findMany()`, teríamos uma camada adicional sem regra própria.

Neste projeto pequeno, preferimos:

```text
Controller
   ↓
Service
   ↓
Prisma
```

### Checkpoint

```text
✓ API NestJS
✓ PostgreSQL configurado
✓ Prisma conectado
✗ usuário
✗ autenticação
✗ tarefas
```

---

# 6. Primeira entidade: usuário

Para criar uma conta precisamos armazenar pelo menos:

```text
id
nome
e-mail
senha
```

No Prisma:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Por que UUID?

É uma forma simples de gerar identificadores únicos sem depender de uma sequência numérica global.

Não é obrigatório. Poderíamos usar inteiro autoincremental.

## Por que e-mail `@unique`?

Porque o login usa o e-mail como identificador.

Duas contas com o mesmo e-mail criariam ambiguidade.

## Criando a migration

```bash
npx prisma migrate dev --name criar_usuario
```

Agora o banco possui a tabela correspondente.

## Criando UsuariosModule e UsuariosService

Estrutura simples:

```text
usuarios/
├── dto/
├── usuarios.controller.ts
├── usuarios.module.ts
└── usuarios.service.ts
```

Neste momento a responsabilidade do `UsuariosService` é cuidar das operações relacionadas a usuário.

Exemplo conceitual:

```ts
@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  buscarPorEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
```

### Você deve conseguir explicar

- o que é uma entidade/modelo;
- por que e-mail é único;
- o que uma migration faz;
- por que `UsuariosService` acessa o Prisma.

---

# 7. Cadastro e proteção da senha

Agora podemos implementar cadastro.

Entrada esperada:

```json
{
  "name": "Ana",
  "email": "ana@email.com",
  "password": "senha-segura"
}
```

## DTO

Criamos um DTO porque queremos validar os dados que entram na API.

Exemplo:

```ts
export class CriarUsuarioDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

A função do DTO é muito simples de explicar:

> descrever e validar os dados que uma rota aceita.

## Nunca salvar senha pura

Isto é errado:

```ts
password: dados.password
```

Se o banco fosse exposto, todas as senhas ficariam visíveis.

Usamos `bcryptjs`:

```ts
const senhaCriptografada = await bcrypt.hash(dados.password, 10);
```

Depois salvamos o hash:

```ts
await prisma.user.create({
  data: {
    name: dados.name,
    email: dados.email,
    password: senhaCriptografada,
  },
});
```

## Verificando duplicidade

Antes de criar:

```ts
const usuarioExistente = await prisma.user.findUnique({
  where: { email: dados.email },
});

if (usuarioExistente) {
  throw new ConflictException('Este e-mail já está em uso.');
}
```

Aqui o `409 Conflict` representa bem o problema: o recurso que queremos criar entra em conflito com um usuário já existente.

## Não retornar senha

Depois de criar o usuário, a resposta não deve expor `password`.

Uma forma explícita:

```ts
const { password, ...usuarioSeguro } = usuario;
return usuarioSeguro;
```

No projeto atual também removemos campos relacionados a redefinição de senha.

## Avatar

O projeto usa Gravatar para gerar um avatar a partir do e-mail.

Isso é uma funcionalidade adicional, não uma necessidade do cadastro mínimo.

É melhor adicionar depois que o cadastro já estiver funcionando.

### Checkpoint

```text
✓ banco
✓ usuário
✓ cadastro
✓ senha com hash
✗ login
✗ JWT
✗ tarefas
```

### Perguntas de entrevista

- por que não salvar senha em texto puro?
- o que o bcrypt armazena?
- por que usamos `409` para e-mail duplicado?
- por que não retornamos `password` na API?

---

# 8. Login e JWT

Agora o usuário existe, mas ainda não consegue provar quem é nas próximas requisições.

O login precisa:

```text
receber e-mail + senha
        ↓
buscar usuário
        ↓
comparar senha com hash
        ↓
gerar token
```

## Comparando a senha

```ts
const usuario = await usuariosService.buscarPorEmail(email);

if (!usuario) {
  throw new UnauthorizedException('Credenciais inválidas.');
}

const senhaValida = await bcrypt.compare(password, usuario.password);

if (!senhaValida) {
  throw new UnauthorizedException('Credenciais inválidas.');
}
```

É importante responder a mesma mensagem para e-mail inexistente e senha incorreta. Isso evita informar gratuitamente se determinada conta existe.

## Gerando JWT

Payload simples:

```ts
const payload = {
  sub: usuario.id,
  email: usuario.email,
  name: usuario.name,
};
```

O campo `sub` representa o identificador principal do usuário.

Geramos:

```ts
const accessToken = jwtService.sign(payload);
```

Resposta:

```json
{
  "accessToken": "...",
  "user": {
    "id": "...",
    "name": "Ana",
    "email": "ana@email.com"
  }
}
```

## Por que JWT?

Sem token, a API não saberia qual usuário está chamando `/tasks`.

Com JWT:

```text
login
  ↓
JWT
  ↓
Authorization: Bearer <token>
  ↓
API identifica usuário
```

## Segredo obrigatório

O segredo não deve ficar hardcoded no código.

```env
JWT_SECRET=uma-chave-segura
```

No backend atual a configuração usa `getOrThrow`, ou seja, se a variável essencial não existir, a aplicação falha na inicialização em vez de usar um fallback escondido.

### Você deve conseguir explicar

- diferença entre senha e token;
- o que existe dentro do JWT;
- por que o segredo fica no ambiente;
- por que `401` significa não autenticado.

---

# 9. Protegendo rotas com JWT

Ter um token só é útil se conseguirmos validá-lo.

No Nest usamos Passport + estratégia JWT.

## Estratégia

Responsabilidades:

1. extrair token do cabeçalho Bearer;
2. validar assinatura;
3. respeitar expiração;
4. transformar payload em usuário da requisição.

Exemplo:

```ts
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: configService.getOrThrow('JWT_SECRET'),
});
```

Depois:

```ts
validate(payload: JwtPayload) {
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
  };
}
```

O resultado passa a ficar disponível em `request.user`.

## Guard

Criamos um Guard baseado em JWT.

Então uma rota protegida pode usar:

```ts
@UseGuards(GuardAutenticacaoJwt)
```

Fluxo:

```text
GET /api/tasks
      ↓
Guard JWT
      ↓
Token válido?
 ├─ não → 401
 └─ sim
      ↓
request.user.id
```

Isso será essencial para tarefas.

### Checkpoint

```text
✓ cadastro
✓ login
✓ JWT
✓ rotas protegidas
✗ tarefas
```

---

# 10. Perfil do usuário

Antes das tarefas podemos criar uma rota simples para validar o fluxo autenticado.

```text
GET /users/me
```

Ela deve retornar os dados do próprio usuário autenticado.

Isso prova três coisas:

- JWT chega corretamente;
- Guard funciona;
- `request.user.id` identifica o usuário.

Também podemos adicionar:

```text
PATCH /users/me
```

No projeto atual o perfil permite alterar apenas o nome.

Isso é intencional.

Não mantemos capacidades escondidas de alterar senha/avatar por essa rota quando a interface não oferece isso.

A senha possui um fluxo específico de redefinição e o avatar vem do Gravatar.

### Regra de design importante

Um método deve fazer o que o nome promete.

Por exemplo:

```ts
buscarPorEmail()
```

não deve silenciosamente atualizar o usuário no banco.

Buscar deve buscar.

Atualizar deve atualizar.

Essa previsibilidade melhora muito a capacidade de entender o sistema.

---

# 11. Criando o domínio de tarefas

Agora chegamos ao núcleo do produto.

Comece com o mínimo:

```text
id
título
status
posição
userId
```

No projeto atual o modelo cresceu para:

```prisma
model Task {
  id              String     @id @default(uuid())
  title           String
  description     String?
  status          TaskStatus @default(TODO)
  priority        String?    @default("Média")
  cardStyle       CardStyle  @default(SPIRAL)
  tags            String[]   @default([])
  attachmentImage String?
  position        Float      @default(0)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  userId          String
  user            User       @relation(fields: [userId], references: [id])
}
```

## Status

```prisma
enum TaskStatus {
  TODO
  DOING
  DONE
}
```

Isso corresponde diretamente às três colunas:

```text
TODO  → A Fazer
DOING → Em Andamento
DONE  → Concluído
```

## Relacionamento com usuário

O campo mais importante para segurança é:

```text
userId
```

Uma tarefa não existe solta. Ela pertence a alguém.

```text
User 1 ──┬── Task A
         ├── Task B
         └── Task C
```

Essa relação permitirá filtrar dados e validar propriedade.

## Rotas mínimas

```text
POST   /tasks
GET    /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
```

Não precisamos criar `/tasks/:id` GET se a interface não possui necessidade real para isso.

### Por que PATCH?

Porque ao editar ou mover um cartão normalmente alteramos apenas parte da tarefa.

Por exemplo:

```json
{
  "status": "DONE",
  "position": 4.5
}
```

Não precisamos reenviar todos os campos.

---

# 12. Garantindo que cada usuário acesse apenas suas tarefas

Autenticação responde:

> Quem é você?

Autorização responde:

> Você pode fazer isso?

São problemas diferentes.

## Listagem

A regra mais simples é filtrar no próprio banco:

```ts
return prisma.task.findMany({
  where: { userId: usuarioId },
});
```

Não faça:

```ts
const todas = await prisma.task.findMany();
return todas.filter(...);
```

Filtrar no banco evita trazer dados que o usuário nunca deveria receber.

## Atualizar e excluir

Antes de alterar uma tarefa:

```ts
const tarefa = await prisma.task.findUnique({
  where: { id },
  select: { userId: true },
});
```

Depois:

```ts
if (!tarefa) {
  throw new NotFoundException('Tarefa não encontrada.');
}

if (tarefa.userId !== usuarioId) {
  throw new ForbiddenException('Permissão negada.');
}
```

Agora temos a diferença:

```text
401 Unauthorized
→ não existe autenticação válida

403 Forbidden
→ usuário está autenticado, mas não possui permissão

404 Not Found
→ recurso não existe
```

## Controller fino

O Controller recebe HTTP e chama o Service.

Exemplo:

```ts
@Patch(':id')
atualizar(
  @Param('id') id: string,
  @Body() dados: AtualizarTarefaDto,
  @Request() requisicao: RequisicaoAutenticada,
) {
  return this.tarefasService.atualizar(
    id,
    requisicao.user.id,
    dados,
  );
}
```

A regra de acesso fica no Service porque pertence à operação da tarefa, não ao protocolo HTTP.

## Fluxo completo

```text
PATCH /tasks/123
      ↓
Guard valida JWT
      ↓
Controller recebe user.id
      ↓
TarefasService
      ↓
valida dono
      ↓
Prisma update
      ↓
PostgreSQL
```

### Checkpoint

```text
✓ cadastro
✓ login
✓ JWT
✓ tarefas CRUD
✓ isolamento por usuário
✗ frontend
```

---

# 13. Criando o frontend React

Agora a API já consegue funcionar sem interface.

Só então começamos o frontend.

Uma forma comum:

```bash
npm create vite@latest web -- --template react-ts
```

Depois:

```bash
cd web
npm install
npm run dev
```

## Estrutura que surge conforme o projeto cresce

```text
web/src/
├── app/
├── components/
├── contexts/
├── hooks/
├── services/
├── styles/
└── types/
```

Não é necessário criar todas essas pastas no primeiro minuto.

Uma evolução natural seria:

```text
1. página de login
2. chamada HTTP
3. serviço de autenticação
4. várias telas precisam do usuário
5. Context
6. quadro cresce
7. hook useQuadro
```

As pastas refletem responsabilidades que apareceram.

## TypeScript

O frontend atual executa:

```bash
npm run typecheck
```

que usa:

```bash
tsc --noEmit
```

Isso verifica os tipos sem gerar arquivos.

O build executa type-check antes do Vite.

Essa validação é importante porque Vite consegue transpilar alguns códigos mesmo quando existem inconsistências de tipos.

---

# 14. Axios e autenticação no frontend

Primeiro poderíamos fazer:

```ts
axios.post('/api/auth/login', dados);
```

Depois, para uma rota protegida:

```ts
axios.get('/api/tasks', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

Então outra:

```ts
axios.patch('/api/tasks/123', dados, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

O mesmo cabeçalho começa a se repetir.

Agora existe uma necessidade real de centralização.

## Criando uma instância Axios

```ts
const api = axios.create({
  baseURL: '/api',
});
```

## Interceptor

```ts
api.interceptors.request.use((configuracao) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    configuracao.headers.Authorization = `Bearer ${token}`;
  }

  return configuracao;
});
```

Agora os services podem apenas fazer:

```ts
api.get('/tasks');
```

### Por que essa abstração vale a pena?

Porque existe repetição concreta.

Explicação para entrevista:

> Todas as rotas autenticadas precisam do Bearer token. Em vez de repetir o cabeçalho em cada chamada, configurei uma instância Axios que adiciona o token quando ele existe.

Essa é uma abstração fácil de defender.

---

# 15. Contexto de autenticação e rotas privadas

Depois do login várias partes precisam saber se existe usuário autenticado:

- roteador;
- cabeçalho;
- configurações;
- botão de logout.

Poderíamos passar `usuario` por props em vários níveis, mas começaria a ficar repetitivo.

Agora Context possui uma necessidade real.

## Serviço de autenticação

Responsabilidades:

```text
entrar
cadastrar
sair
obter usuário salvo
atualizar perfil
solicitar redefinição
redefinir senha
```

Ele também converte o contrato da API para nomes do domínio do frontend.

Exemplo:

```text
API          Frontend
name      →  nome
avatarUrl →  urlAvatar
password  ←  senha
```

Isso permite manter a API com contrato técnico em inglês enquanto a interface usa nomenclatura interna em português.

## Context

Estado principal:

```ts
const [usuario, setUsuario] = useState<Usuario | null>(
  () => servicoAutenticacao.obterUsuario(),
);
```

Ações:

```text
entrar
cadastrar
sair
atualizarPerfil
```

## Rotas

A decisão pode ser explícita:

```tsx
usuario
  ? <LayoutPrincipal />
  : <Navigate to="/login" replace />
```

Não precisamos criar um sistema sofisticado de autorização no frontend porque existem apenas rotas públicas e privadas.

### Importante

O frontend esconder uma rota **não é segurança suficiente**.

A segurança verdadeira continua no backend com Guard e validação de propriedade.

---

# 16. Integração das tarefas com a API

Agora precisamos conectar React a `/tasks`.

Criamos um `servicoTarefas`.

Ele tem operações simples:

```text
listar
criar
atualizar
remover
```

Exemplo:

```ts
async listar(): Promise<Tarefa[]> {
  const resposta = await api.get<TarefaApi[]>('/tasks');
  return resposta.data.map(converterTarefa);
}
```

## Conversor

A API retorna:

```ts
{
  title,
  description,
  cardStyle,
  attachmentImage
}
```

O frontend usa:

```ts
{
  titulo,
  descricao,
  estiloCartao,
  imagemAnexa
}
```

Criamos uma função explícita:

```ts
function converterTarefa(tarefa: TarefaApi): Tarefa {
  return {
    id: tarefa.id,
    titulo: tarefa.title,
    descricao: tarefa.description,
    status: tarefa.status,
    posicao: tarefa.position,
  };
}
```

### Por que não espalhar conversões pelos componentes?

Porque os componentes não precisam conhecer detalhes do contrato HTTP.

O service funciona como fronteira.

Isso permite explicar:

```text
Componente
  ↓ domínio PT-BR
servicoTarefas
  ↓ contrato da API
HTTP
```

---

# 17. Montando o quadro Kanban

Começamos sem drag and drop.

Primeiro precisamos apenas dividir tarefas por status.

```ts
const STATUS_COLUNAS = ['TODO', 'DOING', 'DONE'];
```

Depois:

```tsx
{STATUS_COLUNAS.map((status) => (
  <ColunaKanban
    key={status}
    status={status}
    tarefas={tarefas.filter(
      (tarefa) => tarefa.status === status,
    )}
  />
))}
```

Isso é simples porque o banco já possui `status`.

## Estado das tarefas

```ts
const [tarefas, setTarefas] = useState<Tarefa[]>([]);
```

Ao carregar a página:

```ts
useEffect(() => {
  const carregarTarefas = async () => {
    const tarefasCarregadas = await servicoTarefas.listar();
    setTarefas(tarefasCarregadas);
  };

  void carregarTarefas();
}, []);
```

## Por que `useEffect` aqui?

Porque carregar tarefas é um efeito causado pela montagem da tela.

Não estamos usando `useEffect` simplesmente porque existe React.

Existe uma necessidade concreta: quando a tela aparece, buscar dados externos.

## Por que criar `useQuadro`?

No começo poderíamos manter tudo na página.

Quando a página começa a acumular:

```text
carregar tarefas
criar
editar
excluir
mover
reordenar
tratamento de erro
```

isso passa a ser uma responsabilidade coerente: comportamento do quadro.

Aí um hook faz sentido.

---

# 18. Drag and drop

Somente depois que o quadro funciona com botões e dados reais adicionamos drag and drop.

O projeto usa:

```text
@hello-pangea/dnd
```

Não precisamos entender a implementação interna da biblioteca.

Precisamos entender o contrato que nosso código recebe quando o arraste termina.

Principais informações:

```text
source
  droppableId
  index

destination
  droppableId
  index

draggableId
```

Nosso handler pode ser explicado assim:

```ts
const finalizarArraste = (resultado: DropResult) => {
  const { source, destination, draggableId } = resultado;

  if (!destination) return;

  if (source.droppableId !== destination.droppableId) {
    moverTarefa(...);
    return;
  }

  if (source.index !== destination.index) {
    reordenarCartao(...);
  }
};
```

Isso produz duas situações:

```text
coluna diferente
→ mudar status + posição

mesma coluna
→ mudar apenas posição
```

### Pergunta de entrevista

**Você implementou drag and drop do zero?**

Resposta correta:

> Não. Usei `@hello-pangea/dnd` para a interação. Minha lógica começa no `onDragEnd`: interpreto origem e destino e atualizo status/posição da tarefa.

Isso demonstra conhecimento sem fingir que escreveu a biblioteca.

---

# 19. Ordenação por posição

Agora surge um problema interessante.

Imagine uma coluna:

```text
Tarefa A → posição 1
Tarefa B → posição 2
Tarefa C → posição 3
```

Se movermos C entre A e B, poderíamos renumerar tudo:

```text
A → 1
C → 2
B → 3
```

Isso exigiria várias atualizações.

Uma solução mais simples para este projeto é usar uma posição entre os vizinhos.

```text
A → 1
C → 1.5
B → 2
```

Por isso `position` é `Float`.

## Função

```ts
const calcularPosicao = (anterior?: Tarefa, proxima?: Tarefa) => {
  if (!anterior && proxima) return proxima.posicao / 2;
  if (anterior && !proxima) return anterior.posicao + 1;
  if (anterior && proxima) {
    return (anterior.posicao + proxima.posicao) / 2;
  }
  return 1;
};
```

Casos:

```text
início da coluna
→ próxima / 2

fim da coluna
→ anterior + 1

entre duas
→ média

coluna vazia
→ 1
```

## Trade-off

Depois de um número enorme de reordenações entre os mesmos itens, posições fracionárias podem ficar muito próximas.

Para um Mini Kanban pessoal isso é aceitável.

Em um sistema de grande escala poderíamos renormalizar posições ou usar outra estratégia de ordenação.

### Resposta de entrevista

> Usei posições fracionárias para evitar atualizar todos os cartões da coluna a cada arraste. Para a escala do projeto é uma solução simples e suficiente.

---

# 20. Atualização otimista

A primeira versão pode funcionar assim:

```text
usuário solta card
      ↓
PATCH na API
      ↓
espera resposta
      ↓
atualiza React
```

Funciona, mas a interface parece menos imediata.

Então surge uma necessidade de UX.

## Estratégia otimista

Antes da API:

```ts
const estadoAnterior = [...tarefas];
```

Atualizamos o estado:

```ts
setTarefas((atuais) =>
  atuais.map((tarefa) =>
    tarefa.id === tarefaId
      ? { ...tarefa, status: novoStatus, posicao }
      : tarefa,
  ),
);
```

Depois chamamos API.

Se funcionar, mantemos/atualizamos com resposta.

Se falhar:

```ts
setTarefas(estadoAnterior);
```

Fluxo:

```text
arraste
  ↓
interface muda imediatamente
  ↓
API
 ├─ sucesso → mantém
 └─ erro    → restaura
```

## Por que isso não é “complexidade de sênior” desnecessária?

Porque resolve um problema visível do produto.

E a lógica é explicável em poucas frases.

---

# 21. Comentários

Agora que tarefas funcionam, adicionamos comentários.

Modelagem:

```prisma
model Comment {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())
  taskId    String
  userId    String
}
```

Relacionamentos:

```text
User
  └── Comment
        └── Task
```

## Regras

Para criar/listar comentário:

1. tarefa deve existir;
2. tarefa deve pertencer ao usuário autenticado.

Para excluir comentário:

1. comentário deve existir;
2. usuário precisa ser o autor.

## Por que validar acesso à tarefa antes do comentário?

Sem isso alguém poderia descobrir/comentar em tarefas de outro usuário apenas sabendo o ID.

## Painel separado no frontend

O modal da tarefa começou a acumular:

```text
campos da tarefa
etiquetas
imagem
comentários
CRUD de comentários
```

Comentários possuem estado e operações próprias.

Nesse ponto separar `PainelComentarios` tem uma responsabilidade concreta.

Não dividimos cada input em um microcomponente. Separamos apenas uma área que possui comportamento próprio.

### Princípio

```text
separar porque existe responsabilidade
≠
separar porque o arquivo ficou com muitas linhas
```

---

# 22. Tema e configurações

Tema claro/escuro não exige uma arquitetura de design system inteira.

O projeto usa uma ideia simples:

```text
localStorage
   ↓
light ou dark
   ↓
classe dark no HTML
   ↓
Tailwind dark:
```

## Por que Context para tema?

Porque o tema afeta a aplicação inteira e pode ser alterado em Configurações.

O estado precisa ser acessível em mais de uma parte da árvore.

## O que evitamos

Não mantemos dezenas de tokens genéricos de template se a aplicação já usa Tailwind diretamente.

Preferimos algo que possa ser explicado:

> Tailwind define as cores dos componentes e o Context apenas controla se a classe `dark` está ativa.

## Perfil

A tela permite alterar o nome.

Fluxo:

```text
Configurações
  ↓
ContextoAutenticacao.atualizarPerfil
  ↓
servicoAutenticacao
  ↓
PATCH /users/me
  ↓
UsuariosService
  ↓
Prisma
```

---

# 23. Recuperação de senha

Essa funcionalidade é melhor adicionada quando cadastro/login já estão estáveis.

## Problema

O usuário esqueceu a senha e não está autenticado.

Não podemos simplesmente permitir:

```text
POST /change-password
{ email, novaSenha }
```

Qualquer pessoa poderia trocar a senha de qualquer e-mail conhecido.

Precisamos provar que a pessoa possui acesso ao e-mail.

## Fluxo

```text
1. usuário informa e-mail
2. backend gera token aleatório
3. banco salva HASH do token + expiração
4. e-mail recebe link com token original
5. usuário abre link
6. frontend envia token + nova senha
7. backend cria hash do token recebido
8. procura token válido e não expirado
9. salva nova senha com bcrypt
10. limpa token de recuperação
```

## Gerando token

```ts
const token = crypto.randomBytes(32).toString('hex');
```

## Por que salvar hash do token?

Pelo mesmo princípio das senhas: se o banco for exposto, um token de redefinição ainda válido não deveria poder ser usado diretamente.

```ts
const tokenHash = crypto
  .createHash('sha256')
  .update(token)
  .digest('hex');
```

## Expiração

Exemplo:

```ts
const expiraEm = new Date(Date.now() + 60 * 60 * 1000);
```

Uma hora.

## Evitando enumeração de usuários

Se o e-mail não existir, a rota ainda responde algo como:

> Se existir uma conta com esse e-mail, um link será enviado.

Ela não informa publicamente quais e-mails possuem conta.

## FRONTEND_URL

O link precisa apontar para o frontend:

```text
FRONTEND_URL/reset-password?token=...
```

`FRONTEND_URL` é configuração obrigatória. Não usamos um localhost escondido como fallback em produção.

### Você deve conseguir explicar

- por que não enviamos a nova senha por e-mail;
- por que token expira;
- por que armazenamos hash do token;
- por que não revelamos se o e-mail existe.

---

# 24. Validação, Swagger e tratamento de erros

Quando a aplicação já funciona, melhoramos a fronteira da API.

## ValidationPipe

No `main.ts`:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);
```

### `whitelist`

Remove propriedades que não pertencem ao DTO.

### `transform`

Permite conversões de tipos quando apropriado.

## Prefixo

```ts
app.setGlobalPrefix('api');
```

Assim:

```text
/tasks
```

vira externamente:

```text
/api/tasks
```

## Swagger

O Swagger serve como documentação e ferramenta manual para explorar a API.

```text
/api/docs
```

Ele não substitui testes, mas facilita validar contratos.

## Erros principais

```text
400 → dados inválidos/token inválido
401 → não autenticado
403 → autenticado sem permissão
404 → recurso não encontrado
409 → conflito, como e-mail duplicado
500 → erro inesperado
```

---

# 25. Docker, Nginx e PostgreSQL

Até aqui podemos rodar tudo manualmente:

```text
terminal 1 → PostgreSQL
terminal 2 → NestJS
terminal 3 → Vite
```

Funciona, mas configurar tudo em outra máquina dá trabalho.

Docker entra para tornar o ambiente reproduzível.

## Serviços

O Compose atual possui:

```text
kanban_db
kanban_api
kanban_web
```

## Banco

```yaml
kanban_db:
  image: postgres:17-alpine
```

Com volume:

```text
db_data
```

O volume mantém os dados mesmo quando o container é recriado.

## Healthcheck

A API não deve tentar migrar banco antes de PostgreSQL aceitar conexões.

Por isso o banco possui healthcheck.

## API

A API recebe variáveis como:

```text
DATABASE_URL
JWT_SECRET
FRONTEND_URL
MAIL_HOST
MAIL_PORT
MAIL_USER
MAIL_PASS
MAIL_FROM
```

Na inicialização:

```bash
npx prisma migrate deploy && node dist/main
```

Primeiro aplica migrations pendentes; depois inicia Nest.

## Web

O frontend é compilado e servido por Nginx.

Responsabilidades ficam explícitas:

```text
Nginx → arquivos React
Nest  → API
Postgres → dados
```

Nest não precisa procurar `web/dist` em caminhos diferentes nem servir a interface.

## Proxy

O navegador chama:

```text
/api/tasks
```

Nginx encaminha isso para a API.

Assim o frontend usa apenas:

```ts
axios.create({ baseURL: '/api' });
```

### Checkpoint

```text
✓ frontend
✓ backend
✓ banco
✓ Docker
✓ Nginx
✓ migrations
```

---

# 26. Testes e validação

Um projeto que funciona uma vez no navegador ainda pode quebrar silenciosamente depois.

Criamos diferentes níveis de verificação porque cada um responde a uma pergunta.

## Type-check

```bash
npm run typecheck
```

Pergunta:

> O frontend está consistente para o TypeScript?

O build executa:

```text
tsc --noEmit
      ↓
vite build
```

## Testes de backend

Pergunta:

> As regras do Service funcionam isoladamente?

No `TarefasService`, por exemplo, testamos:

- criação;
- listagem por usuário;
- atualização;
- exclusão;
- bloqueio de usuário diferente;
- tarefa inexistente.

O teste instancia o Service com um mock do Prisma quando não existe necessidade de subir o container inteiro do Nest.

Isso é mais simples de entender.

## Testes frontend

Vitest + Testing Library validam componentes e comportamentos específicos.

## Smoke test da API

No CI existe também um fluxo com PostgreSQL real.

Ele valida coisas como:

```text
cadastro
login
JWT
perfil
tarefas
comentários
usuário 2 não acessa dados do usuário 1
```

Isso prova integração real com Prisma/PostgreSQL.

## E2E com Playwright

Pergunta:

> A aplicação completa funciona como um usuário real usaria?

O navegador percorre o sistema real servido via Docker/Nginx.

Fluxos incluem:

- autenticação;
- criação de tarefa;
- modal;
- comentários;
- drag and drop;
- configurações;
- recuperação de senha (fluxo visual);
- logout.

## Por que vários níveis?

```text
TypeScript → tipos
Unitário   → regra pequena
API real   → integração backend + banco
E2E        → produto completo
```

Nenhum deles sozinho responde todas as perguntas.

---

# 27. Fluxos completos da aplicação

Esta seção é importante para entrevista.

Não memorize arquivos isolados. Aprenda os caminhos.

## 27.1 Cadastro

```text
PaginaLogin (modo cadastro)
        ↓
ContextoAutenticacao.cadastrar
        ↓
servicoAutenticacao.cadastrar
        ↓
POST /api/auth/register
        ↓
AutenticacaoController
        ↓
UsuariosService.criar
        ↓
verifica e-mail
        ↓
bcrypt.hash
        ↓
Prisma user.create
        ↓
PostgreSQL
```

## 27.2 Login

```text
PaginaLogin
   ↓
ContextoAutenticacao.entrar
   ↓
servicoAutenticacao.entrar
   ↓
POST /api/auth/login
   ↓
AutenticacaoController
   ↓
AutenticacaoService
   ↓
buscar usuário
   ↓
bcrypt.compare
   ↓
JwtService.sign
   ↓
accessToken + user
   ↓
localStorage + Context
```

## 27.3 Carregar quadro

```text
PaginaQuadro
   ↓
useQuadro
   ↓
servicoTarefas.listar
   ↓
Axios interceptor adiciona JWT
   ↓
GET /api/tasks
   ↓
GuardAutenticacaoJwt
   ↓
TarefasController
   ↓
TarefasService.listar(user.id)
   ↓
Prisma findMany where userId
   ↓
PostgreSQL
   ↓
conversor API → Tarefa
   ↓
setTarefas
```

## 27.4 Criar tarefa

```text
ModalTarefa
   ↓
useQuadro.salvarTarefa
   ↓
servicoTarefas.criar
   ↓
POST /api/tasks
   ↓
Guard JWT
   ↓
TarefasController
   ↓
TarefasService.criar
   ↓
Prisma conecta user.id
   ↓
PostgreSQL
   ↓
setTarefas
```

## 27.5 Mover cartão

```text
usuário arrasta
   ↓
@hello-pangea/dnd
   ↓
onDragEnd
   ↓
QuadroKanban.finalizarArraste
   ↓
useQuadro.moverTarefa
   ↓
calcularPosicao
   ↓
atualiza React imediatamente
   ↓
PATCH /api/tasks/:id
   ↓
backend valida dono
   ↓
Prisma update
   ↓
se falhar → restaura estado anterior
```

## 27.6 Criar comentário

```text
PainelComentarios
   ↓
servicoComentarios.criar
   ↓
POST /api/tasks/:id/comments
   ↓
Guard JWT
   ↓
ComentariosService
   ↓
valida acesso à tarefa
   ↓
Prisma comment.create
```

## 27.7 Recuperar senha

```text
PaginaEsqueciSenha
   ↓
POST /api/auth/forgot-password
   ↓
AutenticacaoService
   ↓
gera token aleatório
   ↓
salva hash + expiração
   ↓
envia e-mail
   ↓
link /reset-password?token=...
   ↓
PaginaRedefinirSenha
   ↓
POST /api/auth/reset-password
   ↓
valida hash + expiração
   ↓
bcrypt nova senha
   ↓
limpa token
```

---

# 28. Decisões que você deve conseguir defender

## Por que NestJS?

Porque organiza API TypeScript com módulos, injeção de dependência, validação e integração fácil com JWT/Swagger.

Não diga apenas:

> porque é profissional.

## Por que Prisma?

Porque precisamos persistir dados em PostgreSQL e queremos consultas tipadas no TypeScript.

## Por que não usamos Repository manual?

Porque Prisma já representa a camada de acesso a dados. Um repository extra só repassando métodos criaria uma camada sem responsabilidade própria.

## Por que Context para autenticação?

Porque várias telas precisam do usuário e das ações de sessão.

## Por que não Redux?

Porque o estado global atual é pequeno. Context resolve sem adicionar uma biblioteca e conceitos que o projeto não precisa.

## Por que Axios interceptor?

Porque o Bearer token é necessário em várias requisições e repetir o cabeçalho seria redundante.

## Por que hook `useQuadro`?

Porque a página passou a concentrar várias operações relacionadas ao estado do quadro. O hook reúne essa responsabilidade sem criar um sistema global de estado.

## Por que optimistic update?

Porque drag and drop precisa responder imediatamente. Se a API falha, restauramos o estado anterior.

## Por que posição fracionária?

Para mover um cartão entre vizinhos sem renumerar todos os cartões.

## Por que comentários estão em componente separado?

Porque possuem estado e CRUD próprios. Não foi uma divisão apenas para diminuir linhas do modal.

## Por que Docker?

Para reproduzir Postgres, API e frontend de forma consistente.

## Por que Nginx?

Para servir o build do React e encaminhar `/api` ao Nest.

## Por que JWT?

Para identificar o usuário em cada chamada protegida sem manter sessão de servidor.

## Por que validar propriedade no backend?

Porque autenticação não significa autorização. Um usuário autenticado ainda não pode editar tarefa de outro usuário.

---

# 29. O que não colocamos de propósito

Saber o que **não** usar também é uma decisão técnica.

## Clean Architecture completa

Não temos necessidade de:

```text
Controller
  ↓
UseCase
  ↓
Port
  ↓
Adapter
  ↓
Repository
  ↓
Prisma
```

para um CRUD pessoal deste tamanho.

## CQRS

Não existe complexidade de comandos/consultas que justifique separar todo o sistema em handlers.

## DDD completo

O domínio é pequeno. Usar Aggregates, Domain Events, Value Objects e outras estruturas apenas por nomenclatura aumentaria o custo de explicação.

## Microserviços

Autenticação, tarefas e comentários não precisam ser serviços independentes.

Um backend Nest modular é suficiente.

## Redux/Zustand

Context + estado local atendem as necessidades atuais.

## Repository em cima do Prisma

Só seria introduzido se surgisse uma responsabilidade concreta além de repassar chamadas.

## Abstrações de UI genéricas em excesso

O projeto usa componentes quando existe reaproveitamento/responsabilidade clara. Não precisamos de dezenas de wrappers para cada `button`, `input` ou `div`.

## Regra geral

```text
Existe um problema real?
   ↓ sim
A abstração resolve esse problema de forma mais clara?
   ↓ sim
Use.
```

Caso contrário, mantenha o código direto.

---

# 30. Desafio: reconstruir sem olhar o código

Depois de estudar este guia, tente reconstruir uma versão reduzida.

## Etapa 1

Somente:

```text
User
cadastro
PostgreSQL
```

Não faça login ainda.

## Etapa 2

Adicione:

```text
login
bcrypt.compare
JWT
GET /users/me
```

Teste tudo via Swagger/curl antes de React.

## Etapa 3

Adicione:

```text
Task
POST /tasks
GET /tasks
PATCH /tasks/:id
DELETE /tasks/:id
```

Teste usuário A e usuário B.

## Etapa 4

Crie React com apenas:

```text
login
lista simples de tarefas
formulário de nova tarefa
```

Sem Kanban visual.

## Etapa 5

Divida em três colunas usando `status`.

Ainda sem drag and drop.

## Etapa 6

Adicione drag and drop.

Primeiro altere apenas `status`.

Depois resolva reordenação.

## Etapa 7

Adicione comentários.

## Etapa 8

Adicione recuperação de senha.

## Etapa 9

Containerize.

## Etapa 10

Adicione testes e E2E.

Se você conseguir reconstruir até a etapa 6 sem copiar os arquivos originais, provavelmente já entende a parte principal do projeto em profundidade suficiente para explicá-la.

---

# 31. Checklist final de estudo

Antes de apresentar o Mini Kanban, tente responder sem abrir o código.

## Banco

- Qual banco usamos?
- O que o Prisma faz?
- O que é migration?
- Como User, Task e Comment se relacionam?
- Por que `Task.userId` é importante?

## Backend

- Qual a responsabilidade de Controller?
- Qual a responsabilidade de Service?
- Por que Service usa Prisma diretamente?
- O que é DTO?
- O que `ValidationPipe` faz?

## Autenticação

- Como cadastro funciona?
- Onde a senha é protegida?
- Como login funciona?
- O que existe no JWT?
- Como o Guard identifica o usuário?
- Diferença entre 401 e 403?

## Frontend

- Onde o token é salvo?
- Como Axios adiciona o token?
- Por que existe Context de autenticação?
- Qual a responsabilidade de `servicoTarefas`?
- Por que existe conversão API ↔ domínio?

## Kanban

- Como a coluna é determinada?
- O que acontece no `onDragEnd`?
- Como calculamos `position`?
- Por que usamos `Float`?
- Como funciona optimistic update?
- O que acontece se o PATCH falhar?

## Comentários

- Como um comentário se relaciona à tarefa?
- Quem pode excluir comentário?
- Por que validamos a tarefa antes de listar/comentar?

## Recuperação de senha

- Como o token é gerado?
- Por que salvamos o hash?
- Por que existe expiração?
- Por que não dizemos se o e-mail existe?

## Infraestrutura

- O que cada container faz?
- Por que Nginx serve o frontend?
- Como `/api` chega ao Nest?
- Por que PostgreSQL possui volume?
- Por que existe healthcheck?

## Testes

- O que `tsc --noEmit` garante?
- O que um teste unitário garante?
- O que o smoke test da API verifica?
- O que Playwright verifica que o teste unitário não verifica?

---

# Conclusão

O Mini Kanban não precisa ser explicado como uma coleção de tecnologias.

A melhor forma de contar o projeto é como uma sequência de problemas e decisões:

```text
Precisava persistir dados
→ PostgreSQL + Prisma

Precisava criar contas seguras
→ bcrypt

Precisava identificar usuário nas requisições
→ JWT

Precisava impedir acesso entre contas
→ filtro por userId + validação de propriedade

Precisava compartilhar sessão no React
→ Context

Precisava evitar repetir Bearer token
→ interceptor Axios

Precisava organizar lógica crescente do quadro
→ useQuadro

Precisava de drag responsivo
→ atualização otimista

Precisava reordenar sem atualizar a coluna inteira
→ posição entre vizinhos

Comentários ganharam estado próprio
→ PainelComentarios

Precisava reproduzir ambiente
→ Docker Compose

Precisava servir React e encaminhar API
→ Nginx

Precisava evitar regressões
→ type-check + testes + API real + Playwright
```

Esse raciocínio é mais importante do que decorar arquivos.

Se você entende **qual problema fez cada parte nascer**, consegue defender o projeto mesmo que esqueça a sintaxe exata durante uma entrevista.

---

## Referência dentro do repositório

Depois de estudar uma etapa, compare com a implementação atual:

```text
Backend
api/src/autenticacao/
api/src/usuarios/
api/src/tarefas/
api/src/comentarios/
api/src/prisma/
api/prisma/schema.prisma

Frontend
web/src/app/
web/src/components/
web/src/contexts/
web/src/hooks/
web/src/services/
web/src/types/
```

A proposta não é copiar esses arquivos linha por linha.

Use-os para conferir como a versão final resolveu o problema depois que você já tentou raciocinar sobre a solução.
