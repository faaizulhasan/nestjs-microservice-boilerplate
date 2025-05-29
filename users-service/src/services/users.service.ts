import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../models/users.model";
import * as bcrypt from 'bcrypt';
import {API_TOKEN_TYPES, LOGIN_TYPE, MICRO_SERVICES, ROLES} from "../../../shared/constants";
import {UserOtpService} from "./user-otps.service";
import {BaseService} from "../../../shared/base/base-service";
import {Op} from "sequelize";
import {UserApiTokensService} from "./user-api-tokens.service";
import {extractFields} from "../../../shared/helpers";
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { STRIPE_MESSAGE_PATTERNS } from '../../../shared/constants/message-pattern.constant';

@Injectable()
export class UsersService extends BaseService{
    constructor(
        @InjectModel(User) private userModel: any,
        private readonly userOtpService: UserOtpService,
        private readonly userApiTokensService: UserApiTokensService,
        @Inject(MICRO_SERVICES.PAYMENT_SERVICE) private readonly paymentServiceClient: ClientProxy
    ) {
        super(User);
    }
    showColumns(): string[] {
        return ["id","slug","user_type","first_name","last_name","email","mobile_no","password","address","country","city","state","zipcode","latitude","longitude","stripe_customer_id","connect_account_id","transfer_capabilities","login_type","is_activated","is_blocked","push_notification","hide_name","createdAt"];
    }
    getFields() {
        return ["user_type","first_name","last_name","email","mobile_no","password","image_url","address","country","city","state","zipcode","latitude","longitude","stripe_customer_id","connect_account_id","transfer_capabilities","login_type","is_activated","is_blocked","push_notification","hide_name","login_typr"]
    };
    exceptUpdateField(): string[] {
        return ["id","slug","user_type","email","password","is_activated","is_blocked","status","createdAt","updatedAt","deletedAt"];
    };
    includeShow(){
        return [];
    }

    includeIndex(){
        return [];
    }

    async createUser(data){
        const hashed = await bcrypt.hash(data.password, 10);
        const userPayload = {
            ...data,
            password: hashed,
            user_type: ROLES.USER,
            login_type: LOGIN_TYPE.CUSTOM
        };
     
        const user = await this.userModel.create(extractFields(userPayload, this.getFields()));
        /* create customer in stripe */
        const customer = await lastValueFrom(this.paymentServiceClient.send(STRIPE_MESSAGE_PATTERNS.CREATE_CUSTOMER, {email: data.email}));
        /* update user stripe customer id */
        await this.userModel.update({stripe_customer_id: customer.id}, {where: {id: user.id}});
        /* create otp and send mail*/
        await this.userOtpService.create(data);

        return user ? user.toJSON() : user;
    }
    async socialLogin(data) {
        // Check if user exists with the platform_id and platform_type
        let user = await this.userModel.findOne({
            where: {
                platform_id: data.platform_id,
                platform_type: data.platform_type
            }
        });

        if (user) {
            // Update existing user's name and image if provided
            const updateData: any = {};
            
            if (data.name) {
                updateData.first_name = data.name.split(' ')[0] || '';
                updateData.last_name = data.name.split(' ').slice(1).join(' ') || '';
            }
            
            if (data.image_url) {
                updateData.image_url = data.image_url;
            }

            if (Object.keys(updateData).length > 0) {
                await this.userModel.update(updateData, {
                    where: { id: user.id }
                });
                // Refresh user data
                user = await this.userModel.findByPk(user.id);
            }
        } else {
            // If user doesn't exist, create a new user
            const userPayload = {
                email: data.email,
                first_name: data.name?.split(' ')[0] || '',
                last_name: data.name?.split(' ').slice(1).join(' ') || '',
                password: await bcrypt.hash(Math.random().toString(36), 10), // Generate random password
                user_type: ROLES.USER,
                login_type: LOGIN_TYPE.SOCIAL,
                platform_type: data.platform_type,
                platform_id: data.platform_id,
                is_email_verify: data.email ? 1 : 0,
                email_verifyAt: data.email ? new Date() : null,
                is_mobile_verify: data.email ? 1 : 0,
                mobile_verifyAt: data.email ? new Date() : null,
                is_activated: 1,
                image_url: data?.image_url ? data?.image_url : null
            };

            user = await this.userModel.create(userPayload);
            /* create customer in stripe */
            const customer = await lastValueFrom(this.paymentServiceClient.send(STRIPE_MESSAGE_PATTERNS.CREATE_CUSTOMER, {email: data.email}));
            /* update user stripe customer id */
            await this.userModel.update({stripe_customer_id: customer.id}, {where: {id: user.id}});
        }

        // Generate API token
        const tokenData = {
            user_id: user.id,
            device_type: data.device_type,
            device_token: data.device_token,
            type: API_TOKEN_TYPES.ACCESS
        };

        const api_token = await this.userApiTokensService.create(tokenData);
        
        // Return user with token
        const userData = user.toJSON();
        userData.api_token = api_token;
        
        return userData;
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

    async logout(user_id){
        await this.userApiTokensService.destroyRecordByCondition({
            user_id
        });
    }
    async deleteAccount(request){
       await this.userModel.update({
           email: `${request.user.email}-${new Date().getTime()}`,
           mobile_no: `${request.user.mobile_no}-${new Date().getTime()}`
       },{
           where: {
               id: request.user.id
           }
       });
       /* delete api tokens */
        await this.userApiTokensService.destroyRecordByCondition({
            user_id: request.user.id
        });
    }
    async updateDeviceToken(request){
        await this.userApiTokensService.updateRecordByCondition({
            user_id: request.user.id
        },{
            device_token: request.body.device_token
        })
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

    async checkTransferCapability(request){
        const accountInfo: any = await lastValueFrom(this.paymentServiceClient.send(STRIPE_MESSAGE_PATTERNS.CHECK_CAPABILITY, {account_id: request.query.account_id}));
        console.log("accountInfo:",accountInfo);
        const has_capabilities: boolean = accountInfo.capabilities.transfers === "active" ? true : false;
        if(has_capabilities){
            await this.userModel.update({
                connect_account_id: request.query.account_id,
                transfer_capabilities: 1
            },{
                where: {
                    id: accountInfo.metadata.user_id
                }
            });
        }
        return true;
    }
}
