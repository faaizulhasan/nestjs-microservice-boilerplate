import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Payload } from '@nestjs/microservices';
import { NOTIFICATION_MESSAGE_PATTERNS } from '../../shared/constants';
import { MessagePattern } from '@nestjs/microservices';
import { BaseController } from '../../shared/base/base-controller';
import { NotificationResource } from './notification.resource';
import { SendNotificationDto } from '../../shared/dtos/send-notification.dto';
@Controller()
export class NotificationController extends BaseController {
  constructor(private readonly notificationService: NotificationService) {
    super(NotificationResource,NotificationService);
  }

  @MessagePattern(NOTIFICATION_MESSAGE_PATTERNS.GET_ALL_NOTIFICATIONS)
  async getAllNotifications(@Payload() request): Promise<any> {
    try {
      this.pagination = true;
      this.collection = true;
      this.request = request;
      let query = {
        where: {
          user_id: request.user.id
        }
      }
      const notifications = await this.notificationService.getRecords(request,query);
      return this.successResponse(notifications,"Notifications retrieved successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
  @MessagePattern(NOTIFICATION_MESSAGE_PATTERNS.GET_UNREAD_COUNT)
  async getUnreadCount(@Payload() request): Promise<any> {
    try {
      this.pagination = false;
      this.collection = false;
      this.request = request;
      
      const notification_count = await this.notificationService.getUnreadCount(request.user.id);
  
      return this.successResponse({count:notification_count},"Unread count retrieved successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
  @MessagePattern(NOTIFICATION_MESSAGE_PATTERNS.MARK_ALL_READ)
  async markAllRead(@Payload() request): Promise<any> {
    try {
      this.pagination = false;
      this.collection = false;
      this.request = request;
      
      await this.notificationService.markAllRead(request.user.id);
  
      return this.successResponse({},"Mark All Read successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
  @MessagePattern(NOTIFICATION_MESSAGE_PATTERNS.MARK_SINGLE_READ)
  async markSingleRead(@Payload() request): Promise<any> {
    try {
      this.pagination = false;
      this.collection = false;
      this.request = request;
      
      await this.notificationService.markSingleRead(request.user.id,request.params.id);
  
      return this.successResponse({},"Mark Single Read successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
  @MessagePattern(NOTIFICATION_MESSAGE_PATTERNS.SEND_NOTIFICATION)
  async sendNotification(@Body() body: SendNotificationDto): Promise<any> {
    try {
      this.pagination = false;
      this.collection = true;
      
      const notification = await this.notificationService.sendNotification(body);
  
      return this.successResponse(notification,"Notification sent successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
  
}
