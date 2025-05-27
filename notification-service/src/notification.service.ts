import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notification.model';
import { BaseService } from '../../shared/base/base-service';
@Injectable()
export class NotificationService extends BaseService {
  constructor(
    @InjectModel(Notification) private notificationModel: any,
  ) {
    super(Notification);
  }

  async getUnreadCount(userId: number): Promise<number> {
    const unreadCount = await this.notificationModel.count({
      where: {
        user_id: userId,
        is_read: false
      } 
    });
    return unreadCount;
  }

  async markAllRead(userId: number): Promise<void> {
    await this.notificationModel.update({ is_read: true }, { where: { user_id: userId } });
  }

  async markSingleRead(userId: number, notificationId: number): Promise<void> {
    await this.notificationModel.update({ is_read: true }, { where: { id: notificationId, user_id: userId } });
  }
  async sendNotification(payload): Promise<void> {
    const notification = await this.notificationModel.create(payload);
    return notification;
  }
}
