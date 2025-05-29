import { Module } from '@nestjs/common';
import { UserCardsService } from './user-cards.service';
import { UserCardsController } from './user-cards.controller';
import { UserCard } from './user-cards.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UserCard]),
    StripeModule
  ],
  controllers: [UserCardsController],
  providers: [UserCardsService],
})
export class UserCardsModule {}
