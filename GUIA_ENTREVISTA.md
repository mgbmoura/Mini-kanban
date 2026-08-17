# Guia de apresentação do Mini Kanban

Este roteiro serve como apoio. A apresentação fica melhor quando você explica com suas palavras e abre poucos arquivos, sempre conectando código e comportamento.

## Resumo em um minuto

> O Mini Kanban é uma aplicação full stack para organizar tarefas. O frontend foi feito em React e conversa com uma API NestJS. A API usa JWT para identificar o usuário, Prisma para acessar o PostgreSQL e bcrypt para proteger senhas. Cada tarefa pertence a um usuário. No quadro, o card é atualizado primeiro na tela e depois na API, o que deixa o arrastar e soltar mais rápido para quem usa.

## Demonstração de cinco minutos

1. Cadastre um usuário e faça login.
2. Crie uma tarefa com prioridade e descrição.
3. Mova o card entre as colunas e reordene dois cards.
4. Edite a tarefa e adicione um comentário.
5. Mostre o tema claro/escuro e encerre com o Swagger.

Evite navegar por todas as pastas. Abra somente os arquivos que sustentam o que acabou de demonstrar.

## Arquivos para abrir

| Assunto | Arquivo | O que explicar |
| --- | --- | --- |
| Rotas protegidas | `web/src/routes/app-router.tsx` | Usuário sem sessão volta para o login. |
| Token no frontend | `web/src/api/axios-config.ts` | O interceptor inclui o JWT nas chamadas. |
| Estado do quadro | `web/src/app/pages/BoardPage.tsx` | A página carrega tarefas e coordena criar, mover, editar e excluir. |
| Drag-and-drop | `web/src/components/KanbanBoard.tsx` | O componente traduz o evento de arrastar em ID, coluna e posição. |
| Proteção da API | `api/src/auth/guards/jwt-auth.guard.ts` | A rota só continua com um token válido. |
| Regra de tarefas | `api/src/tasks/tasks.service.ts` | O `userId` filtra a busca e valida o dono antes de alterar. |
| Banco de dados | `api/prisma/schema.prisma` | User, Task e Comment têm relacionamentos explícitos. |

## Como o movimento de um card funciona

1. `KanbanBoard` recebe o resultado do drag-and-drop.
2. A página remove mentalmente o card da lista de destino.
3. A nova posição é calculada entre o card anterior e o seguinte.
4. O estado do React é atualizado imediatamente.
5. A API persiste `status` e `position`.
6. Se a chamada falhar, o estado anterior é restaurado.

A posição fracionária evita renumerar todos os cards a cada movimento. Exemplo: entre as posições `2` e `3`, o novo card recebe `2.5`. Como evolução, muitas reordenações poderiam exigir uma rotina de normalização das posições.

## Como a segurança funciona

- A senha é armazenada como hash do bcrypt, não em texto puro.
- No login, a API devolve um JWT com o ID do usuário.
- O frontend envia esse token no cabeçalho `Authorization`.
- O guard valida o token e disponibiliza o usuário para o controller.
- O service usa o ID autenticado para buscar e alterar dados.

O ponto importante é: receber o ID de uma tarefa não basta para editá-la. A API também compara o dono da tarefa com o usuário do token.

## Perguntas prováveis

### Por que separar controller e service?

O controller trata HTTP: rota, parâmetros e corpo. O service concentra a regra de negócio e o acesso ao Prisma. Essa separação deixa a regra testável sem precisar iniciar um servidor.

### Por que não guardar todas as tarefas apenas no frontend?

O estado local melhora a interação, mas o PostgreSQL é a fonte persistente. Após criar, editar ou excluir, o quadro recarrega os dados da API. Ao mover, usa atualização otimista e desfaz a mudança se houver erro.

### Como um usuário é impedido de acessar tarefas de outro?

A listagem filtra por `userId`. Para atualizar ou excluir, o service busca a tarefa e compara `task.userId` com o ID obtido do JWT.

### O que você melhoraria em uma próxima versão?

- testes de integração com banco temporário;
- renovação de sessão com refresh token;
- normalização periódica das posições dos cards;
- fila de e-mail para recuperação de senha;
- acessibilidade e alternativa ao drag-and-drop pelo teclado.

## O que dizer sobre a simplificação

> A primeira versão cresceu rápido e acumulou dependências, componentes não usados e duas soluções de drag-and-drop. Eu revisei os imports, mantive apenas o que estava em uso e concentrei a movimentação dos cards em um único fluxo. A interface não mudou, mas o projeto ficou menor e mais fácil de testar e explicar.

Não diga que domina um trecho que ainda não consegue explicar. Se esquecer um detalhe, descreva primeiro o fluxo e então use o arquivo para localizar a implementação.
