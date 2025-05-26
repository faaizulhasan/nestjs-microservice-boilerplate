import {Column, DataType, Model, Table} from 'sequelize-typescript';
import {UserCreationAttributes, UserInterface} from "../../../shared/interfaces/user.interface";
import {getFileUrl} from "../../../shared/helpers";

@Table({
    tableName: 'users',
    timestamps: true,
    paranoid: true
})
export class User extends Model<UserInterface,UserCreationAttributes> {
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    user_type: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false
    })
    first_name: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false
    })
    last_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email: string;


    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    mobile_no: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    address: string;
   
    @Column({
        type: DataType.STRING(100),
        allowNull: true,
    })
    country: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true,
    })
    city: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true,
    })
    state: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true,
    })
    zipcode: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    latitude: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    longitude: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        get(this) {
            const rawValue = this.getDataValue('image_url');
            return rawValue ? getFileUrl(rawValue) : null;
        },
    })
    image_url: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: true
    })
    stripe_customer_id: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: true
    })
    connect_account_id: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    })
    transfer_capabilities: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    })
    status: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    })
    is_email_verify: number;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    email_verifyAt: string;


    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    })
    is_mobile_verify: number;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    mobile_verifyAt: string;

    @Column({
        type: DataType.STRING(30),
        allowNull: true
    })
    login_type: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    platform_type: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    platform_id: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    })
    is_activated: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    })
    is_blocked: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    })
    push_notification: number;
   
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    })
    hide_name: number;
}
