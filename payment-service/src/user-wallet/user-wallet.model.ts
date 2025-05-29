import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { UserWalletInterface } from '../../../shared/interfaces/user-wallet.interface';
@Table({
    tableName: 'user_wallet',
    timestamps: true,
    paranoid: true,
})
export class UserWallet extends Model<UserWalletInterface, UserWalletInterface> {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
    })
    user_id: number;

    @Column({
        type: DataType.FLOAT(20, 2),
        allowNull: false,
        defaultValue: 0
    })
    wallet_amount: number;
}
