import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../shared/base/base-service';
import { Page } from './pages.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PagesService extends BaseService {
    constructor(
        @InjectModel(Page) private readonly pagesModel: typeof Page,
    ) {
        super(Page);
    }
}