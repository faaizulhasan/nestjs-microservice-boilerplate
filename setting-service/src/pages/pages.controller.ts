import { Controller } from '@nestjs/common';
import { PagesService } from './pages.service';
import { BaseController } from '../../../shared/base/base-controller';
import { PagesResource } from './pages.resource';
import { Payload } from '@nestjs/microservices';
import { SETTING_MESSAGE_PATTERNS } from '../../../shared/constants/message-pattern.constant';
import { MessagePattern } from '@nestjs/microservices';

@Controller('pages')
export class PagesController extends BaseController {
  constructor(private readonly pageService: PagesService) {
    super(PagesResource, PagesService);
  }

  @MessagePattern(SETTING_MESSAGE_PATTERNS.GET_ALL_PAGES)
  async getAllPages(@Payload() request: any): Promise<any> {
    try {
      this.collection = true;
      this.pagination = false;
      this.request = request;
      const page = await this.pageService.getRecords(request);
      return this.successResponse(page, "Pages fetched successfully");
    } catch (error) {
      console.log(error);
      return this.sendError(error.message);
    }
  }

  @MessagePattern(SETTING_MESSAGE_PATTERNS.GET_PAGE)
  async getPage(@Payload() request: any): Promise<any> {
    try {
      this.collection = true;
      this.pagination = false;
      this.request = request; 
      const page = await this.pageService.findRecordByCondition({
        slug: request.params.slug
      });
      return this.successResponse(page, "Page fetched successfully");
    } catch (error) {
      console.log(error);
      return this.sendError(error.message);
    }
  }

}
