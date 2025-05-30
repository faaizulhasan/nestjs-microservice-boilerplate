import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { PageInterface } from '../../../shared/interfaces/page.interface';
@Table({
    tableName: 'pages',
    timestamps: true,
    paranoid: true,
})
export class Page extends Model<PageInterface, PageInterface> {
    @Column({
        type: DataType.STRING(200),
        allowNull: false,
        unique: true
    })
    title: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
        unique: true
    })
    slug: string;

    @Column({
        type: DataType.TEXT('long'),
        allowNull: false,
    })
    content: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    url: string;
} 