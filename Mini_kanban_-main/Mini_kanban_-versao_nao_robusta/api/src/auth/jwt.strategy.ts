// Importa as classes `ExtractJwt` e `Strategy` da biblioteca passport-jwt.
import { ExtractJwt, Strategy } from 'passport-jwt';
// Importa o `PassportStrategy` para criar uma estratégia de autenticação customizada.
import { PassportStrategy } from '@nestjs/passport';
// Importa o decorador `Injectable` para marcar a classe como um provedor.
import { Injectable } from '@nestjs/common';

// Marca a classe como um provedor que pode ser gerenciado pelo container de injeção de dependência do NestJS.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Configura a estratégia JWT no construtor da classe pai.
    super({
      // Define que o JWT será extraído do cabeçalho de autorização como um Bearer Token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Garante que tokens expirados sejam rejeitados. `false` é o padrão e a opção mais segura.
      ignoreExpiration: false,
      // A chave secreta usada para verificar a assinatura do token. DEVE ser a mesma chave usada no `JwtModule`.
      secretOrKey: 'mini-kanban-secret-key', 
    });
  }

  /**
   * O método `validate` é chamado pelo NestJS após a verificação bem-sucedida do token JWT.
   * O retorno deste método é o que será anexado ao objeto `request` (geralmente como `req.user`).
   * @param payload - O payload decodificado do token JWT.
   * @returns Um objeto simplificado com os dados do usuário que serão usados nas rotas protegidas.
   */
  async validate(payload: any) {
    // O payload contém os dados que foram colocados nele durante o login (sub, email, nome).
    // Retornamos um objeto que estará disponível no `req.user` dos controllers.
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
