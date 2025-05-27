import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { NotificationInterface } from "../../shared/interfaces/notification.interface";

@Table({
  tableName: 'notifications',
  timestamps: true,
  paranoid: true
})
export class Notification extends Model<NotificationInterface, NotificationInterface> {

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING(300),
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  badge: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1
  })
  mutable_content: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1
  })
  content_available: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  image_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    get(this) {
      const rawValue = this.getDataValue('payload');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(this, value) {
      this.setDataValue('payload', JSON.stringify(value));
    }
  })
  payload: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 0,
  })
  is_read: number;
}
