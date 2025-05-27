import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { SettingInterface } from '../../shared/interfaces/setting.interface';

@Table({
  tableName: 'settings',
  timestamps: true,
  paranoid: true
})
export class Setting extends Model<SettingInterface, SettingInterface> {
  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  text: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  type: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  url: string;
} 