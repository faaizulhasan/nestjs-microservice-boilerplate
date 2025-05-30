import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Setting } from './setting.model';


@Module({
  imports: [
    SequelizeModule.forFeature([Setting])
  ],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule { }
