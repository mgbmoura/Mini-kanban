import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configuracao: ConfigService) => {
        const host = configuracao.getOrThrow<string>('MAIL_HOST');
        const port = Number(configuracao.getOrThrow<string>('MAIL_PORT'));
        const secure = configuracao.getOrThrow<string>('MAIL_SECURE') === 'true';
        const user = configuracao.getOrThrow<string>('MAIL_USER');
        const pass = configuracao.getOrThrow<string>('MAIL_PASS');
        const from = configuracao.getOrThrow<string>('MAIL_FROM');

        return {
          transport: {
            host,
            port,
            secure,
            auth: { user, pass },
          },
          defaults: {
            from: `'Mini Kanban' <${from}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
  exports: [MailerModule],
})
export class EmailModule {}
