import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CriarUsuarioDto } from '../usuarios/dto/criar-usuario.dto';
import { AutenticacaoService } from './autenticacao.service';
import { EntrarDto } from './dto/entrar.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';

@ApiTags('Auth')
@Controller('auth')
export class AutenticacaoController {
  constructor(
    private readonly autenticacaoService: AutenticacaoService,
    private readonly usuariosService: UsuariosService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  cadastrar(@Body() dados: CriarUsuarioDto) {
    return this.usuariosService.criar(dados);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login e geração de token JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  entrar(@Body() credenciais: EntrarDto) {
    return this.autenticacaoService.entrar(credenciais);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar redefinição de senha' })
  @ApiResponse({ status: 200, description: 'Solicitação recebida.' })
  async solicitarRedefinicao(@Body() dados: EsqueciSenhaDto) {
    await this.autenticacaoService.solicitarRedefinicaoSenha(dados);
    return {
      message: 'Se existir uma conta com esse e-mail, um link de redefinição será enviado.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redefinir a senha' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso.' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado.' })
  redefinirSenha(@Body() dados: RedefinirSenhaDto) {
    return this.autenticacaoService.redefinirSenha(dados);
  }
}
