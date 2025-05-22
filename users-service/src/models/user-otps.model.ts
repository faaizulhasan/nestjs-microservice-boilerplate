import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({
    tableName: 'user_otps',
    timestamps: true,
    paranoid: true
})
export class UserOtp extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    email: string;


    @Column({
        type: DataType.STRING(15),
        allowNull: true
    })
    mobile_no: string;


    @Column({
        type: DataType.STRING(10),
        allowNull: false
    })
    otp: string;
}
