import {NestFactory} from '@nestjs/core';
import {MailerModule} from './mailer.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {REDIS_CREDENTIALS} from "../../shared/constants";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MailerModule, {
    transport: Transport.REDIS,
    options: { port: REDIS_CREDENTIALS.PORT, host: REDIS_CREDENTIALS.HOST }
  });

  await app.listen();
}
bootstrap();
