import { Injectable } from '@nestjs/common';
import { UserWallet } from './user-wallet.model';
import { InjectModel } from '@nestjs/sequelize';
import { WALLET_TYPE } from '../../../shared/constants';

@Injectable()
export class UserWalletService {
    constructor(@InjectModel(UserWallet) private readonly userWalletModel: typeof UserWallet) {}

    async getUserWallet(request: any): Promise<any> {
        let userWallet = await this.userWalletModel.findOne({ where: { user_id: request.user.id } });
        if (!userWallet) {
            userWallet = await this.userWalletModel.create({ user_id: request.user.id, wallet_amount: 0 });
        }
        return userWallet.toJSON();
    }
    async updateUserWallet(payload: {user_id: number, amount: number, type: number}): Promise<any> {
        let userWallet = await this.userWalletModel.findOne({ where: { user_id: payload.user_id } });
        if (!userWallet) {
            userWallet = await this.userWalletModel.create({ user_id: payload.user_id, wallet_amount: 0 });
        }
        if(payload.type === WALLET_TYPE.CREDIT){
            userWallet.wallet_amount += payload.amount;
        }else if(payload.type === WALLET_TYPE.DEBIT){
            userWallet.wallet_amount -= payload.amount;
        }
        await userWallet.save();    
        return userWallet.toJSON();
    }
}