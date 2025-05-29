import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { REDIS_CREDENTIALS } from '../../shared/constants';
import { MICRO_SERVICES } from '../../shared/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserCardsModule } from './user-cards/user-cards.module';
import { StripeModule } from './stripe/stripe.module';
import { UserCard } from './user-cards/user-cards.model';
import { UserWalletModule } from './user-wallet/user-wallet.module';
import { UserWallet } from './user-wallet/user-wallet.model';
import { TransactionsModule } from './transactions/transactions.module';
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
    UserCardsModule,
    StripeModule,
    UserWalletModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class PaymentModule { }
