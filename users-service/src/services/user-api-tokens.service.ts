import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {BaseService} from "../../../shared/base/base-service";
import {UserApiToken} from "../models/user-api-tokens.model";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserApiTokensService extends BaseService{
    constructor(
        @InjectModel(UserApiToken) private userOtpModel: typeof UserApiToken,
        private jwtService: JwtService,
    ) {
        super(UserApiToken);
    }
    async create(data: {type: string,user_id: number, device_type: string,device_token: string}){
        const token = await this.jwtService.sign({ sub: data.user_id });
        /* delete previous api token */
        await this.userOtpModel.destroy({
            where: {
                user_id: data.user_id,
                type: data.type
            },
            force: true
        })
        const api_token = await this.userOtpModel.create({
            user_id: data.user_id,
            api_token: token,
            device_type: data?.device_type || null,
            device_token: data?.device_token || null,
            type: data.type
        });
        return token;
    }
}
