import {Body, Controller, Delete, Get, Inject, Patch, Post, Request, UseGuards, Param} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {MICRO_SERVICES, SETTING_MESSAGE_PATTERNS} from "../../../shared/constants";
import { SettingDto } from "../../../shared/dtos/setting.dto";
import { AdminAuthGuard } from "../guards/admin-auth-guard";

@Controller()
export class SettingProxyController {
    constructor(@Inject(MICRO_SERVICES.SETTING_SERVICE) private client: ClientProxy) {}

    @Get('/setting')
    async getSetting(@Request() req: any) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
        }
        return this.client.send(SETTING_MESSAGE_PATTERNS.GET_SETTING, payload);
    }


    //pages routes
    @Get('pages/:slug')
    async getPage(@Request() req: any, @Param('slug') slug: string) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params
        }
        return this.client.send(SETTING_MESSAGE_PATTERNS.GET_PAGE, payload);
    }
    @Get('pages')
    async getAllPages(@Request() req: any) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params
        }
        return this.client.send(SETTING_MESSAGE_PATTERNS.GET_ALL_PAGES, payload);
    }
    
}