import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Notification } from './notification.model';
import { REDIS_CREDENTIALS } from '../../shared/constants';
import { MICRO_SERVICES } from '../../shared/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    //import .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    // Redis Microservice Client
    ClientsModule.register([
      {
        name: MICRO_SERVICES.USERS_SERVICE,
        transport: Transport.REDIS,
        options: REDIS_CREDENTIALS,
      },
    ]),
    // Sequelize Configuration
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
      }),
    }),

    // Sequelize Models
    SequelizeModule.forFeature([Notification])
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule { }
