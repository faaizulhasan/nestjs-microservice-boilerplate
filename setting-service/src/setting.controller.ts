import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingService } from './setting.service';
import { Payload } from '@nestjs/microservices';
import { MessagePattern } from '@nestjs/microservices';
import { BaseController } from '../../shared/base/base-controller';
import { SettingResource } from './setting.resource';
import { SETTING_MESSAGE_PATTERNS } from '../../shared/constants';

@Controller()
export class SettingController extends BaseController {
  constructor(private readonly settingService: SettingService) {
    super(SettingResource,SettingService);
  }

  @MessagePattern(SETTING_MESSAGE_PATTERNS.GET_SETTING)
  async getSetting(@Payload() request: any): Promise<any> {
    try {
      this.collection = true;
      this.pagination = false;
      this.request = request;
      const setting = await this.settingService.getSetting();
      return this.successResponse(setting,"Setting fetched successfully");
    } catch (error) {
      console.log(error);
      return this.sendError(error.message);
    }
  }
}
