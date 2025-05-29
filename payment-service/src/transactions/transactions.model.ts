import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { TransactionInterface } from '../../../shared/interfaces/transaction.interface';
@Table({
    tableName: 'transactions',
    timestamps: true,
    paranoid: true,
})
export class Transaction extends Model<TransactionInterface, TransactionInterface> {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
    })
    user_id: number;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true
    })
    task_id: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    gateway_transaction_id: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    transaction_type: string;

    @Column({
        type: DataType.FLOAT(20, 2),
        allowNull: false,
        defaultValue: 0.00,
    })
    previous_amount: number;

    @Column({
        type: DataType.FLOAT(20, 2),
        allowNull: false,
        defaultValue: 0.00,
    })
    new_amount: number;

    @Column({
        type: DataType.FLOAT(20, 2),
        allowNull: false,
        defaultValue: 0.00,
    })
    platform_fee: number;

    @Column({
        type: DataType.FLOAT(20, 2),
        allowNull: false,
        defaultValue: 0.00,
    })
    transaction_amount: number;

    @Column({
        type: DataType.FLOAT(20, 2),
        allowNull: false,
        defaultValue: 0.00,
    })
    total_amount: number;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    status: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description: string;
}
