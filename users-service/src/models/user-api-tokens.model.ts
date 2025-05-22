import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({
    tableName: 'user_api_tokens',
    timestamps: true,
    paranoid: true
})
export class UserApiToken extends Model {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    user_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    api_token: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    device_type: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    device_token: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    type: string;
}
