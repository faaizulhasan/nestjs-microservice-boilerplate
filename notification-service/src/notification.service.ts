import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notification.model';
import { BaseService } from '../../shared/base/base-service';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { MICRO_SERVICES } from '../../shared/constants';
import { USER_MESSAGE_PATTERNS } from '../../shared/constants/message-pattern.constant';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class NotificationService extends BaseService {
  constructor(
    @InjectModel(Notification) private notificationModel: any,
    private configService: ConfigService,
    @Inject(MICRO_SERVICES.USERS_SERVICE) private readonly userClient: ClientProxy
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
    const device_token = await lastValueFrom(this.userClient.send(USER_MESSAGE_PATTERNS.GET_USER_DEVICE_TOKEN, payload.user_id));
    if(device_token){
      this.sendPushNotification(device_token.device_token, {title: payload.title, body: payload.message},payload.payload);
    }
    return notification;
  }

  async sendPushNotification(registrationTokens, notification: {title: string, body: string}, data = {}) {
    if (!admin.apps.length) {
      admin.initializeApp({
          credential: admin.credential.cert({
            clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
            privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY'),
            projectId: this.configService.get<string>('FIREBASE_PROJECT_ID')
          })
      });
  }
    const message: any = {
        notification: {
            title: notification.title,
            body: notification.body
        },
        data: data,
    };

    try {
        message.token = registrationTokens;
        const response: any = await admin.messaging().send(message);
        console.log('Successfully sent notification:', response);
        console.log('Push Notification Response:', response.responses);
        return response;
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}
}
