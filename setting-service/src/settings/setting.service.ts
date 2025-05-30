import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from './setting.model';
import { BaseService } from '../../../shared/base/base-service';

@Injectable()
export class SettingService extends BaseService {
  constructor(
    @InjectModel(Setting) private settingModel: any,
  ) {
    super(Setting);
  }
  async getSetting() {
    return this.findRecordByCondition({ deletedAt: null });
  }
  async updateSetting(payload: any) {
    return this.settingModel.update(payload.body, { where: { id: payload.params.id } });
  } 
}
