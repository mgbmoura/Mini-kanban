import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importe o ConfigModule e o ConfigService

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // Registra o JwtModule de forma assíncrona
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa o ConfigModule para que o ConfigService esteja disponível
      useFactory: async (configService: ConfigService) => ({
        // Busca a chave secreta das variáveis de ambiente
        secret: configService.get<string>('JWT_SECRET'),
        // Busca o tempo de expiração das variáveis de ambiente
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService], // Injeta o ConfigService na useFactory
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
