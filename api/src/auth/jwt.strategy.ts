// Importa as classes `ExtractJwt` e `Strategy` da biblioteca passport-jwt.
import { ExtractJwt, Strategy } from 'passport-jwt';
// Importa o `PassportStrategy` para criar uma estratégia de autenticação customizada.
import { PassportStrategy } from '@nestjs/passport';
// Importa o decorador `Injectable` para marcar a classe como um provedor.
import { Injectable } from '@nestjs/common';
// Importa o `ConfigService` para acessar variáveis de ambiente de forma segura.
import { ConfigService } from '@nestjs/config';

/**
 * JwtStrategy: O Guardião das rotas.
 * Esta classe é responsável por pegar o token enviado pelo frontend, 
 * descriptografá-lo e verificar se ele é autêntico.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // 1. Extração: Como vamos achar o token? No Header de autorização como "Bearer TOKEN".
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Validação: Tokens expirados devem ser rejeitados.
      ignoreExpiration: false,
      // 3. Segurança: Chave secreta usada para validar a assinatura do token.
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * O método `validate` é chamado automaticamente se o token for válido.
   * O que retornamos aqui será injetado no objeto `request` (ex: `req.user`).
   * @param payload - Os dados descriptografados de dentro do token (sub, email, name).
   */
  async validate(payload: any) {
    // Retornamos um objeto simples que identifica o usuário logado para os controllers.
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
