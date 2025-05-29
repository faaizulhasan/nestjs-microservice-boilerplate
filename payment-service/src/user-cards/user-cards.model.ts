import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { UserCardInterface } from '../../../shared/interfaces/user-card.interface';
@Table({
    tableName: 'user_cards',
    timestamps: true,
    paranoid: true,
})
export class UserCard extends Model<UserCardInterface, UserCardInterface> {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
    })
    user_id: number;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    payment_method_id: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    brand: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    expiry_month: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    expiry_year: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    last_four: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    fingerprint: string;
}
