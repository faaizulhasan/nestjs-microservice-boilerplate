import { Injectable } from '@nestjs/common';
import { Transaction } from './transactions.model';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionInterface } from '../../../shared/interfaces/transaction.interface';
import { BaseService } from '../../../shared/base/base-service';

@Injectable()
export class TransactionsService extends BaseService {
    constructor(@InjectModel(Transaction) private readonly transactionModel: typeof Transaction) {
        super(Transaction);
    }

    async createTransaction(payload: TransactionInterface, transaction: any) {
        return this.transactionModel.create(payload, { transaction });
    }
    
}
