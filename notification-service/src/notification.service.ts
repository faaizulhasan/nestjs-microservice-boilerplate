import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notification.model';
import { BaseService } from '../../shared/base/base-service';
@Injectable()
export class NotificationService extends BaseService {
  constructor(
    @InjectModel(Notification) private notificationModel: Notification,
  ) {
    super(Notification);
  }
}
