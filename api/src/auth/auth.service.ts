// Importa decoradores e classes de exceção do NestJS.
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Importa o JwtService para criar e assinar tokens JWT.
import { JwtService } from '@nestjs/jwt';
// Importa o UsersService para acessar os dados dos usuários.
import { UsersService } from '../users/users.service';
// Importa o DTO para os dados de login.
import { LoginDto } from './dto/login.dto';
// Importa a biblioteca bcrypt para comparar senhas.
import * as bcrypt from 'bcrypt';

// Marca a classe como um provedor que pode ser injetado.
@Injectable()
export class AuthService {
  // Injeta os serviços necessários no construtor.
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  /**
   * Valida as credenciais do usuário e, se forem válidas, retorna um token JWT.
   * @param data - Contém o e-mail e a senha do usuário.
   * @returns Um objeto com o token de acesso e os dados do usuário.
   */
  async login(data: LoginDto) {
    // 1. Busca o usuário pelo e-mail fornecido.
    const user = await this.usersService.findByEmail(data.email);

    // 2. Verifica se o usuário existe e se a senha fornecida corresponde à senha hasheada no banco.
    if (user && (await bcrypt.compare(data.password, user.password))) {
      // 3. Se as credenciais estiverem corretas, cria o payload do token.
      // O payload contém informações que serão codificadas no token JWT.
      const payload = { sub: user.id, email: user.email, name: user.name };

      // 4. Gera o token JWT e o retorna junto com os dados do usuário.
      return {
        accessToken: this.jwtService.sign(payload), // Assina o payload para criar o token.
        user: { id: user.id, name: user.name, email: user.email }, // Retorna dados básicos do usuário.
      };
    }

    // 5. Se o usuário não for encontrado ou a senha estiver incorreta, lança uma exceção.
    throw new UnauthorizedException('Credenciais inválidas');
  }
}
