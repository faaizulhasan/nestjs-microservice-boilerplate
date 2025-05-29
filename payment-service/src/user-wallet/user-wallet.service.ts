import { Injectable, Inject } from '@nestjs/common';
import { UserWallet } from './user-wallet.model';
import { InjectModel } from '@nestjs/sequelize';
import { TRANSACTION_TYPE } from '../../../shared/constants';
import { TransactionsService } from 'src/transactions/transactions.service';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class UserWalletService {
    constructor(
        @InjectModel(UserWallet) private readonly userWalletModel: typeof UserWallet,
        private readonly transactionService: TransactionsService,
        private readonly stripeService: StripeService
    ) { }

    async getUserWallet(request: any): Promise<any> {
        let userWallet = await this.userWalletModel.findOne({ where: { user_id: request.user.id } });
        if (!userWallet) {
            userWallet = await this.userWalletModel.create({ user_id: request.user.id, wallet_amount: 0 });
        }
        return userWallet.toJSON();
    }
    async updateUserWallet(payload: { user_id: number, amount: number, type: string }, transaction: any) {
        let userWallet: any = await this.userWalletModel.findOne({ where: { user_id: payload.user_id }, raw: true });
        if (!userWallet) {
            userWallet = await this.userWalletModel.create({ user_id: payload.user_id, wallet_amount: 0 }, { transaction });
            userWallet = userWallet.toJSON();
        }
        let newAmount = userWallet.wallet_amount;

        if (payload.type === TRANSACTION_TYPE.CREDIT) {
            newAmount += payload.amount;
        } else if (payload.type === TRANSACTION_TYPE.DEBIT) {
            newAmount -= payload.amount;
        }
        await this.userWalletModel.update(
            { wallet_amount: newAmount },
            {
                where: { user_id: payload.user_id },
                transaction,
            },
        );
        return { ...userWallet, wallet_amount: newAmount };
    }
    async withdrawAmount(request: any, transaction: any) {
        let userWallet: any = await this.userWalletModel.findOne({ where: { user_id: request.user.id }, raw: true });
        if (!userWallet) {
            throw new Error("User wallet not found");
        }
        if (userWallet.wallet_amount < request.body.amount) {
            throw new Error("Insufficient balance");
        }
        if (!request.user.connect_account_id) {
            throw new Error("Connect account not found");
        }
        const payout = await this.stripeService.transfer(request.body.amount,request.user.connect_account_id);
        // add transaction
        await this.transactionService.createTransaction({
            user_id: request.user.id,
            gateway_transaction_id: payout.id,
            transaction_type: TRANSACTION_TYPE.DEBIT,
            previous_amount: userWallet.wallet_amount,
            new_amount: userWallet.wallet_amount - request.body.amount,
            platform_fee: 0,
            transaction_amount: request.body.amount,
            total_amount: request.body.amount,
            status: "success",
            description: "Withdrawal"
        }, transaction);
        userWallet = await this.updateUserWallet({ user_id: request.user.id, amount: request.body.amount, type: TRANSACTION_TYPE.DEBIT }, transaction);
        return userWallet;
    }
}