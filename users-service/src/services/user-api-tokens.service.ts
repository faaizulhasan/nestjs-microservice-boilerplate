import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {BaseService} from "../../../shared/base/base-service";
import {UserApiToken} from "../models/user-api-tokens.model";
import {JwtService} from "@nestjs/jwt";
import {API_TOKEN_TYPES} from "../../../shared/constants";
import { Op } from 'sequelize';
import { User } from '../models/users.model';
@Injectable()
export class UserApiTokensService extends BaseService{
    constructor(
        @InjectModel(UserApiToken) private userApiTokenModel: typeof UserApiToken,
        @InjectModel(User) private userModel: typeof User,
        private jwtService: JwtService,
    ) {
        super(UserApiToken);
    }
    async create(data: {type: string,user_id: number, device_type: string,device_token: string}){
        const token = await this.jwtService.sign({ sub: data.user_id });
        /* delete previous api token */
        await this.userApiTokenModel.destroy({
            where: {
                user_id: data.user_id,
                type: data.type
            },
            force: true
        })
        const api_token = await this.userApiTokenModel.create({
            user_id: data.user_id,
            api_token: token,
            device_type: data?.device_type || null,
            device_token: data?.device_token || null,
            type: data.type
        });
        return token;
    }
    async verifyToken(token, type = API_TOKEN_TYPES.ACCESS){
        const api_token = await this.findRecordByCondition({
            api_token: token,
            type: type
        });
        return api_token;
    }
    async getUserDeviceToken(user_id: number){
        const check_user = await this.userModel.findOne({
            where: {
                id: user_id,
                push_notification: 1
            }
        });
        if(!check_user){
            return null;
        }
        const api_token = await this.findRecordByCondition({
            user_id: user_id,
            device_token: {
                [Op.not]: null
            }
        });
        return api_token;
    }
}
