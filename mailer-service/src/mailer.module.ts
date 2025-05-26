import {Module} from '@nestjs/common';
import {MailerController} from './mailer.controller';
import {MailerService} from './mailer.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
     //import .env file
     ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
