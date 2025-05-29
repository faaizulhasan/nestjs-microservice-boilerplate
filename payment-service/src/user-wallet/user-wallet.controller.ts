import { Controller } from '@nestjs/common';
import { UserWalletService } from './user-wallet.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BaseController } from '../../../shared/base/base-controller';
import { PAYMENT_MESSAGE_PATTERNS } from '../../../shared/constants/message-pattern.constant';
import { UserWalletResource } from './user-wallet.resource';
@Controller()
export class UserWalletController extends BaseController {
  constructor(private readonly userWalletService: UserWalletService) {
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
  async updateUserWallet(@Payload() payload: { user_id: number, amount: number, type: number }): Promise<any> {
    const userWallet = await this.userWalletService.updateUserWallet(payload);
    return userWallet;
  }
} 
