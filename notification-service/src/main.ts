import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';

import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {REDIS_CREDENTIALS} from "../../shared/constants";
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationModule, {
    transport: Transport.REDIS,
    options: REDIS_CREDENTIALS
  });

  await app.listen();
}
bootstrap();
