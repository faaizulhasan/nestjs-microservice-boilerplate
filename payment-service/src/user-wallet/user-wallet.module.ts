import { Module } from '@nestjs/common';
import { UserWalletService } from './user-wallet.service';
import { UserWalletController } from './user-wallet.controller';
import { UserWallet } from './user-wallet.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([UserWallet])],
  controllers: [UserWalletController],
  providers: [UserWalletService],
})
export class UserWalletModule {}
