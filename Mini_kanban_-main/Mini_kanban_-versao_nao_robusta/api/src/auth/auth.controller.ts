// Importa decoradores e classes do NestJS para criar o controller.
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
// Importa o serviço de autenticação que contém a lógica de negócio.
import { AuthService } from './auth.service';
// Importa os Data Transfer Objects (DTOs) para tipagem e validação dos dados de entrada.
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
// Importa decoradores do Swagger para a documentação da API.
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// Importa o serviço de usuários para o endpoint de registro.
import { UsersService } from '../users/users.service';

// Agrupa os endpoints sob a tag 'Auth' na documentação do Swagger.
@ApiTags('Auth')
// Define o prefixo da rota para todos os endpoints neste controller como '/auth'.
@Controller('auth')
export class AuthController {
  // Injeta os serviços de autenticação e de usuários através do construtor.
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  /**
   * Endpoint para registrar um novo usuário.
   * Rota: POST /auth/register
   */
  @Post('register')
  // Documentação do endpoint no Swagger.
  @ApiOperation({ summary: 'Cadastrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' }) // Conflito
  register(@Body() createUserDto: CreateUserDto) {
    // Delega a criação do usuário para o `UsersService`.
    return this.usersService.create(createUserDto);
  }

  /**
   * Endpoint para realizar o login de um usuário.
   * Rota: POST /auth/login
   */
  @Post('login')
  // Define o código de status HTTP para 200 (OK) em caso de sucesso.
  @HttpCode(HttpStatus.OK)
  // Documentação do endpoint no Swagger.
  @ApiOperation({ summary: 'Login e geração de Token JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' }) // Não autorizado
  login(@Body() loginDto: LoginDto) {
    // Chama o serviço de autenticação para validar as credenciais e gerar um token.
    return this.authService.login(loginDto);
  }
}
