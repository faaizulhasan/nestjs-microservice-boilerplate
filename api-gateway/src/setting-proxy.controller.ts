import {Body, Controller, Delete, Get, Inject, Patch, Post, Request, UseGuards, Param} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {MICRO_SERVICES, SETTING_MESSAGE_PATTERNS} from "../../shared/constants";
import { SettingDto } from "../../shared/dtos/setting.dto";
import { AdminAuthGuard } from "./guards/admin-auth-guard";

@Controller('setting')
export class SettingProxyController {
    constructor(@Inject(MICRO_SERVICES.SETTING_SERVICE) private client: ClientProxy) {}

    @Get(':type')
    async getSetting(@Request() req: any) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(SETTING_MESSAGE_PATTERNS.GET_SETTING_BY_TYPE, payload);
    }

    @UseGuards(AdminAuthGuard)
    @Patch(':id')
    async updateSetting(@Request() req: any, @Body() body: SettingDto) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(SETTING_MESSAGE_PATTERNS.UPDATE_SETTING, payload);
    }
}