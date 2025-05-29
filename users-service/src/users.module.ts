import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controllers
import { UsersController } from './users.controller';

// Services
import { UsersService } from './services/users.service';
import { UserOtpService } from './services/user-otps.service';
import { UserApiTokensService } from './services/user-api-tokens.service';

// Models
import { User } from './models/users.model';
import { UserApiToken } from './models/user-api-tokens.model';
import { UserOtp } from './models/user-otps.model';
import { Role } from './models/roles.model';

// Constants
import {
  JWT_EXPIRY,
  JWT_SECRET,
  MICRO_SERVICES,
  REDIS_CREDENTIALS,
} from '../../shared/constants';

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
        name: MICRO_SERVICES.MAILER_SERVICE,
        transport: Transport.REDIS,
        options: REDIS_CREDENTIALS,
      },
      {
        name: MICRO_SERVICES.PAYMENT_SERVICE,
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
    SequelizeModule.forFeature([User, UserApiToken, UserOtp, Role]),

    // JWT Module
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRY },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserOtpService, UserApiTokensService],
  exports: [UsersService, UserOtpService],
})
export class UsersModule {}
