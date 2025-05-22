import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../models/users.model";
import * as bcrypt from 'bcrypt';
import {API_TOKEN_TYPES, ROLES} from "../../../shared/constants";
import {UserOtpService} from "./user-otps.service";
import {BaseService} from "../../../shared/base/base-service";
import {Op} from "sequelize";
import {UserApiTokensService} from "./user-api-tokens.service";
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class UsersService extends BaseService{
    protected readonly jwtService;
    constructor(
        @InjectModel(User) private userModel: any,
        private readonly userOtpService: UserOtpService,
        private readonly userApiTokensService: UserApiTokensService
    ) {
        super(User);
        this.jwtService = JwtService;
    }

    async createUser(data){
        const hashed = await bcrypt.hash(data.password, 10);
        const userPayload = {
            ...data,
            password: hashed,
            user_type: ROLES.USER
        };
        const user = await this.userModel.create(userPayload);
        /* create otp and send mail*/
        await this.userOtpService.create(data);

        return user ? user.toJSON() : user;
    }

    async findUserByEmail(email: string){
        const user = await this.userModel.findOne({where: { email }});
        return user ? user.toJSON() : user;
    }
    async findUserByMobileNo(mobile_no: string){
        const user = await this.userModel.findOne({where: { mobile_no }});
        return user ? user.toJSON() : user;
    }

    async verifyOtp(data){
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        let condition: any = {
            otp: data.otp,
            createdAt: {
                [Op.gte]: fifteenMinutesAgo,
            },
        }
        if (data?.email){
            condition.email = data.email;
        }
        if (data?.mobile_no){
            condition.mobile_no = data.mobile_no;
        }
        const user_otp = await this.userOtpService.findRecordByCondition(condition);
        if (!user_otp){
            throw new Error("Invalid OTP");
        }
        await this.userModel.update({
            is_email_verify: 1,
            email_verifyAt: new Date(),
            is_mobile_verify: 1,
            mobile_verifyAt: new Date()
        },{
            where: {
                email: data.email
            }
        });
        /* delete user otp */
        await this.userOtpService.destroyRecord(user_otp.id);
        let user;
        if (data?.email){
            user = await this.findUserByEmail(user_otp.email);
        }else{
            user = await this.findUserByMobileNo(user_otp.email);
        }
        if (!user){
            throw new Error("User not found");
        }
        /* generate api token */
        data.user_id = user.id;
        data.type = data?.type ? data.type : API_TOKEN_TYPES.ACCESS;
        const api_token = await this.userApiTokensService.create(data);
        user.api_token = api_token;
        return user;
    }

    async resendOtp(data: {email: string}){
        const user = await this.findUserByEmail(data.email);
        if (!user){
            throw new Error("User not found");
        }
        /* create otp and send mail*/
        await this.userOtpService.create(data);
    }

    async resetPassword(request){
        const hashed = await bcrypt.hash(request.body.new_password, 10);
        /* Update Password */
        await this.userModel.update({
            password: hashed,
        },{
            where: {
                id: request.user.id
            }
        });
        /* delete api token */
        await this.userApiTokensService.destroyRecordByCondition({user_id: request.user.id},true);
    }

    async changePassword(request){
        const {current_password, new_password} = request.body;
        const isMatch = await bcrypt.compare(current_password, request.user.password);
        if (!isMatch){
            throw new Error("Current password doesn't match");
        }
        const hashed = await bcrypt.hash(new_password, 10);
        /* Update Password */
        await this.userModel.update({
            password: hashed,
        },{
            where: {
                id: request.user.id
            }
        });
    }


    async validateUser(email: string, password: string) {
        const user = await this.findUserByEmail(email);
        if (!user){
            throw new Error("User Not Found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Incorrect Password");
        return user;
    }
}
