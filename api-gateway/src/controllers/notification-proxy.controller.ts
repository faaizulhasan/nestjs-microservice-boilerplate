import {Body, Controller, Delete, Get, Inject, Patch, Post, Request, UseGuards} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {MICRO_SERVICES, NOTIFICATION_MESSAGE_PATTERNS} from "../../../shared/constants";
import {ApiAuthGuard} from "../guards/api-auth-guard";
import { SendNotificationDto } from "../../../shared/dtos/send-notification.dto";
@Controller('notification')
export class NotificationProxyController {
    constructor(@Inject(MICRO_SERVICES.NOTIFICATION_SERVICE) private client: ClientProxy) {}

    @UseGuards(ApiAuthGuard)
    @Get('get-all')
    async getAllNotifications(@Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(NOTIFICATION_MESSAGE_PATTERNS.GET_ALL_NOTIFICATIONS, payload);
    }
    @UseGuards(ApiAuthGuard)
    @Get('get-unread-count')
    async getUnreadCount(@Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(NOTIFICATION_MESSAGE_PATTERNS.GET_UNREAD_COUNT, payload);
    }
    @UseGuards(ApiAuthGuard)
    @Post('mark-all-read')
    async markAllRead(@Request() req: any) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(NOTIFICATION_MESSAGE_PATTERNS.MARK_ALL_READ, payload);
    }
    @UseGuards(ApiAuthGuard)
    @Post('mark-single-read/:id')
    async markSingleAllRead(@Request() req: any) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(NOTIFICATION_MESSAGE_PATTERNS.MARK_SINGLE_READ, payload);
    }
   
    @Post('send-notification')
    async sendTestNotification(@Body() body: SendNotificationDto) {
        
        return this.client.send(NOTIFICATION_MESSAGE_PATTERNS.SEND_NOTIFICATION, body);
    }
}