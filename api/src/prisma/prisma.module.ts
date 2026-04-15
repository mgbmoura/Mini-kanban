import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        return new PrismaService({ datasources: { db: { url: databaseUrl } } });
      },
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
