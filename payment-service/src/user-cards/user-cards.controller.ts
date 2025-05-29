import { Controller } from '@nestjs/common';
import { UserCardsService } from './user-cards.service';
import { Payload } from '@nestjs/microservices';
import { MessagePattern } from '@nestjs/microservices';
import { PAYMENT_MESSAGE_PATTERNS } from '../../../shared/constants/message-pattern.constant';
import { BaseController } from '../../../shared/base/base-controller';
import { UserCardResource } from './user-cards.resource';

@Controller()
export class UserCardsController extends BaseController {
  constructor(private readonly userCardsService: UserCardsService) {
    super(UserCardResource, UserCardsService);
  }

  @MessagePattern(PAYMENT_MESSAGE_PATTERNS.CREATE_USER_CARD)
  async create(@Payload() request): Promise<any> {
    try {
      this.pagination = false;
      this.collection = true;
      this.request = request;
      const userCard = await this.userCardsService.createRecord(request);
      console.log("userCard:", userCard);
      return this.successResponse(userCard, "User card created successfully");
    } catch (error) {
      return this.sendError(error.message);
    }
  }
  @MessagePattern(PAYMENT_MESSAGE_PATTERNS.GET_ALL_USER_CARDS)
  async getAll(@Payload() request): Promise<any> {
    try {
      this.pagination = true;
      this.collection = true;
      this.request = request;
      const userCards = await this.userCardsService.getAllRecords(request);
      return this.successResponse(userCards, "User cards fetched successfully");
    } catch (error) {
      return this.sendError(error.message);
    }
  }
  @MessagePattern(PAYMENT_MESSAGE_PATTERNS.DELETE_USER_CARD)
  async delete(@Payload() request): Promise<any> {
    try {
      this.pagination = false;
      this.collection = true;
      this.request = request;
      const userCard = await this.userCardsService.deleteRecord(request);
      return this.successResponse(userCard, "User card deleted successfully");
    } catch (error) {
      return this.sendError(error.message);
    }
  }
}
