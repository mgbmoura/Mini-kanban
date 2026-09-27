import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GuardAutenticacaoJwt } from '../autenticacao/guards/guard-autenticacao-jwt';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { UsuariosService } from './usuarios.service';

interface RequisicaoAutenticada {
  user: { id: string; email: string; name: string };
}

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(GuardAutenticacaoJwt)
@Controller('users')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Retorna os dados do usuário autenticado.' })
  obterPerfil(@Request() requisicao: RequisicaoAutenticada) {
    return this.usuariosService.buscarPorId(requisicao.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Retorna os dados atualizados do usuário.' })
  atualizarPerfil(
    @Request() requisicao: RequisicaoAutenticada,
    @Body() dados: AtualizarUsuarioDto,
  ) {
    return this.usuariosService.atualizar(requisicao.user.id, dados);
  }
}
