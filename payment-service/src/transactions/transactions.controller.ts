import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { BaseController } from '../../../shared/base/base-controller';
import { PAYMENT_MESSAGE_PATTERNS } from '../../../shared/constants/message-pattern.constant';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionResource } from './transactions.resource';

@Controller()
export class TransactionsController extends BaseController {
  constructor(private readonly transactionsService: TransactionsService) {
    super(TransactionResource,TransactionsService);
  }

  @MessagePattern(PAYMENT_MESSAGE_PATTERNS.GET_TRANSACTIONS)
    async getTransactions(@Payload() request: any): Promise<any> {
      try{
        this.pagination = true;
        this.collection = true;
        this.request = request;
        
        const { user } = request;
        const transactions = await this.transactionsService.getRecords(request,{
          where: {
            user_id: user.id
          }
        });
        return this.successResponse(transactions,"Transactions fetched successfully");
      }catch(error){
        return this.sendError(error.message);
      }
    }
}