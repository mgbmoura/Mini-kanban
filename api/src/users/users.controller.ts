import { Controller, Get, Request, UseGuards, Patch, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedRequest } from '../auth/auth.types';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Retorna os dados do usuário (sem senha).' })
  getProfile(@Request() request: AuthenticatedRequest) {
    return request.user;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Retorna os dados atualizados do usuário.' })
  updateProfile(@Request() request: AuthenticatedRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(request.user.id, updateUserDto);
  }
}
