import { Controller } from '@nestjs/common';
import { UserWalletService } from './user-wallet.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BaseController } from '../../../shared/base/base-controller';
import { PAYMENT_MESSAGE_PATTERNS } from '../../../shared/constants/message-pattern.constant';
import { UserWalletResource } from './user-wallet.resource';
import { Sequelize } from 'sequelize-typescript';
@Controller()
export class UserWalletController extends BaseController {
  constructor(private readonly userWalletService: UserWalletService, private sequelize: Sequelize) {
    super(UserWalletResource, UserWalletService);
  }

  @MessagePattern(PAYMENT_MESSAGE_PATTERNS.GET_USER_WALLET)
  async getUserWallet(@Payload() request): Promise<any> {
    try {
      this.pagination = false;
      this.collection = true;
      this.request = request;
      const userWallet = await this.userWalletService.getUserWallet(request);
      return this.successResponse(userWallet, "User wallet fetched successfully");
    } catch (error) {
      return this.sendError(error.message);
    }
  }
  @MessagePattern(PAYMENT_MESSAGE_PATTERNS.UPDATE_USER_WALLET)
  async updateUserWallet(@Payload() payload: { user_id: number, amount: number, type: string }): Promise<any> {
    const transaction = await this.sequelize.transaction();
    try { 
      const userWallet = await this.userWalletService.updateUserWallet(payload, transaction);
      await transaction.commit();
      return userWallet;
    } catch (error) {
      await transaction.rollback();
      throw new Error(error.message);
    }
  }
  @MessagePattern(PAYMENT_MESSAGE_PATTERNS.WITHDRAW_AMOUNT)
  async withdrawAmount(@Payload() request): Promise<any> {
    const transaction = await this.sequelize.transaction();
    try {
      this.collection = false;
      this.pagination = false;
      this.request = request;
      const withdrawAmount = await this.userWalletService.withdrawAmount(request, transaction);
      await transaction.commit();
      return this.successResponse(withdrawAmount, "Withdraw amount successfully");
    } catch (error) {
      console.log("error:", error);
      await transaction.rollback();
      return this.sendError(error.message);
    }
  }
} 
