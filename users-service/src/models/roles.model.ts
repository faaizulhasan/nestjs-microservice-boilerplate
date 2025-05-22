import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({
    tableName: 'roles',
    timestamps: true,
    paranoid: true
})
export class Role extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    title: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    type: string;
}
