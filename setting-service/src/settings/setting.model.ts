import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { SettingInterface } from '../../../shared/interfaces/setting.interface';

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
    type: DataType.FLOAT(20,2),
    allowNull: false
  })
  gst: number;
 
  @Column({
    type: DataType.FLOAT(20,2),
    allowNull: false,
    defaultValue: 0
  })
  platform_fee: number;
 
  @Column({
    type: DataType.FLOAT(20,2),
    allowNull: false,
    defaultValue: 0
  })
  platform_commission: number;
} 