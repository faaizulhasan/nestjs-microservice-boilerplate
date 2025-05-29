import { Injectable } from '@nestjs/common';
import { UserWallet } from './user-wallet.model';
import { InjectModel } from '@nestjs/sequelize';

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
}