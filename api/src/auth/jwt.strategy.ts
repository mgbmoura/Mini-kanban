// Importa as classes `ExtractJwt` e `Strategy` da biblioteca passport-jwt.
import { ExtractJwt, Strategy } from 'passport-jwt';
// Importa o `PassportStrategy` para criar uma estratégia de autenticação customizada.
import { PassportStrategy } from '@nestjs/passport';
// Importa o decorador `Injectable` para marcar a classe como um provedor.
import { Injectable } from '@nestjs/common';
// Importa o `ConfigService` para acessar variáveis de ambiente de forma segura.
import { ConfigService } from '@nestjs/config';

// Marca a classe como um provedor que pode ser gerenciado pelo container de injeção de dependência do NestJS.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Construtor da JwtStrategy.
   * @param configService - Serviço injetado para acessar as configurações da aplicação (variáveis de ambiente).
   */
  constructor(private configService: ConfigService) {
    // Configura a estratégia JWT no construtor da classe pai.
    super({
      // Define que o JWT será extraído do cabeçalho de autorização como um Bearer Token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Garante que tokens expirados sejam rejeitados. `false` é o padrão e a opção mais segura.
      ignoreExpiration: false,
      // CORREÇÃO: Busca a chave secreta do `ConfigService` (variáveis de ambiente).
      // Isto garante que a mesma chave usada para assinar o token (no AuthModule) é usada para verificá-lo aqui.
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * O método `validate` é chamado pelo NestJS após a verificação bem-sucedida do token JWT.
   * O retorno deste método é o que será anexado ao objeto `request` (como `req.user`).
   * @param payload - O payload decodificado do token JWT.
   * @returns Um objeto simplificado com os dados do usuário que serão usados nas rotas protegidas.
   */
  async validate(payload: any) {
    // O payload contém os dados que foram colocados nele durante o login (sub, email, nome).
    // Retornamos um objeto que estará disponível no `req.user` dos controllers.
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
