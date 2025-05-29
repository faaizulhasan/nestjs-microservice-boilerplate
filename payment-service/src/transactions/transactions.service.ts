import { Injectable } from '@nestjs/common';
import { Transaction } from './transactions.model';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionInterface } from '../../../shared/interfaces/transaction.interface';

@Injectable()
export class TransactionsService {
    constructor(@InjectModel(Transaction) private readonly transactionModel: typeof Transaction) {}

    async createTransaction(payload: TransactionInterface, transaction: any) {
        return this.transactionModel.create(payload, { transaction });
    }
}
