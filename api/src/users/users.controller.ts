// Importa decoradores e classes necessárias do NestJS e Swagger.
import { Controller, Get, Request, UseGuards, Patch, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
// Importa o guard de autenticação JWT para proteger as rotas.
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// Importa o serviço de usuários para interagir com os dados dos usuários.
import { UsersService } from './users.service';
// Importa o DTO para a atualização de dados do usuário.
import { UpdateUserDto } from './dto/update-user.dto';

// Agrupa os endpoints sob a tag 'Users' na documentação do Swagger.
@ApiTags('Users')
// Define o prefixo da rota para todos os endpoints neste controller como '/users'.
@Controller('users')
export class UsersController {
  // Injeta o UsersService para usar seus métodos.
  constructor(private usersService: UsersService) {}

  /**
   * Endpoint para obter o perfil do usuário atualmente autenticado.
   * Rota: GET /users/me
   */
  @Get('me')
  // Protege a rota, exigindo um token JWT válido.
  @UseGuards(JwtAuthGuard)
  // Indica no Swagger que esta rota requer um Bearer Token.
  @ApiBearerAuth()
  // Descreve a operação no Swagger.
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  // Descreve a resposta de sucesso.
  @ApiResponse({ status: 200, description: 'Retorna os dados do usuário (sem senha).' })
  getProfile(@Request() req) {
    // O `JwtAuthGuard` anexa o payload do usuário (extraído do token) ao objeto de requisição.
    // Simplesmente retornamos esse objeto `req.user` que contém id, email, nome, etc.
    return req.user;
  }

  /**
   * Endpoint para atualizar o perfil do usuário autenticado.
   * Rota: PATCH /users/me
   */
  @Patch('me')
  @UseGuards(JwtAuthGuard) // Protege a rota.
  @ApiBearerAuth() // Requer token no Swagger.
  @ApiOperation({ summary: 'Atualizar perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Retorna os dados atualizados do usuário.' })
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    // O `req.user` contém o payload do token JWT, incluindo o ID do usuário.
    const userId = req.user.id;
    // Chama o serviço `update` para aplicar as alterações, passando o ID do usuário e os dados do DTO.
    return this.usersService.update(userId, updateUserDto);
  }
}
