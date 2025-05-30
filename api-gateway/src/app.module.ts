import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UserProxyController } from "./controllers/user-proxy.controller";
import { JWT_EXPIRY, JWT_SECRET, MICRO_SERVICES, REDIS_CREDENTIALS } from "../../shared/constants";
import { JwtModule } from "@nestjs/jwt";
import { NotificationProxyController } from './controllers/notification-proxy.controller';
import { SettingProxyController } from './controllers/setting-proxy.controller';
import { PaymentProxyController } from './controllers/payment-proxy.controller';
import { WebhookProxyController } from './controllers/webhook-proxy.controller';
import { MediaProxyController } from './controllers/media-proxy.controller';
import { ConfigModule } from '@nestjs/config';

import Redis from 'ioredis';
const redis = new Redis(REDIS_CREDENTIALS);

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});
@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICRO_SERVICES.USERS_SERVICE,
        transport: Transport.REDIS,
        options: REDIS_CREDENTIALS,
      },
      {
        name: MICRO_SERVICES.NOTIFICATION_SERVICE,
        transport: Transport.REDIS,
        options: REDIS_CREDENTIALS,
      },
      {
        name: MICRO_SERVICES.SETTING_SERVICE,
        transport: Transport.REDIS,
        options: REDIS_CREDENTIALS,
      },
      {
        name: MICRO_SERVICES.PAYMENT_SERVICE,
        transport: Transport.REDIS,
        options: REDIS_CREDENTIALS,
      }
    ]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRY },
    }),
    //import .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    })
  ],
  controllers: [
    UserProxyController,
    NotificationProxyController,
    SettingProxyController,
    PaymentProxyController,
    WebhookProxyController,
    MediaProxyController
  ],
  providers: [AppService],
})
export class AppModule { }
