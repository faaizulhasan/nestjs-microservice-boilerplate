import { Module } from '@nestjs/common';
import { UserWalletService } from './user-wallet.service';
import { UserWalletController } from './user-wallet.controller';
import { UserWallet } from './user-wallet.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { StripeModule } from 'src/stripe/stripe.module';
@Module({
  imports: [
    SequelizeModule.forFeature([UserWallet]),
    TransactionsModule,
    StripeModule
  ],
  controllers: [UserWalletController],
  providers: [UserWalletService],
})
export class UserWalletModule {}
