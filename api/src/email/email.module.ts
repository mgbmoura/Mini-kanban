import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configuracao: ConfigService) => ({
        transport: {
          host: configuracao.get('MAIL_HOST'),
          port: configuracao.get<number>('MAIL_PORT'),
          secure: configuracao.get('MAIL_SECURE') === 'true',
          auth: {
            user: configuracao.get('MAIL_USER'),
            pass: configuracao.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: `'Mini Kanban' <${configuracao.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  exports: [MailerModule],
})
export class EmailModule {}
