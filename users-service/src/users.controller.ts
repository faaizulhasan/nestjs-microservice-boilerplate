import {Controller} from '@nestjs/common';
import {UsersService} from './services/users.service';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {API_TOKEN_TYPES, USER_MESSAGE_PATTERNS} from "../../shared/constants";
import {UserResource} from "./resources/users.resource";
import {BaseController} from "../../shared/base/base-controller";
import {UserApiTokensService} from "./services/user-api-tokens.service";
import {UserOtpService} from "./services/user-otps.service";

@Controller()
export class UsersController extends BaseController{
  constructor(
      private readonly usersService: UsersService,
      private readonly userApiTokensService: UserApiTokensService,
      private readonly userOtpService: UserOtpService,
  ) {
    super(UserResource,UsersService);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.LOGIN)
  async login(@Payload() request) {
    try {
      this.request = request;
      this.pagination = false;
      this.collection = true;
      let body = request.body;
      const user = await this.usersService.validateUser(body.email,body.password);
      let data = {
        user_id: user.id,
        type: API_TOKEN_TYPES.ACCESS,
        device_type: body.device_type,
        device_token: body.device_token
      }
      if (!user.is_email_verify || !user.is_mobile_verify){
        /* create otp and send mail*/
        await this.userOtpService.create(body);
        return this.sendError("Email or Mobile No is not verified", 428,{
          email: user.email,
          mobile_no: user.mobile_no
        });
      }
      data.user_id = user.id;
      data.type = API_TOKEN_TYPES.ACCESS;
      const api_token = await this.userApiTokensService.create(data);
      user.api_token = api_token;
      return this.successResponse(user,"Login successfully");
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.REGISTER)
  async register(@Payload() request) {
    try {
      let body = request.body;
      this.collection = false;
      this.pagination = false;
      this.request = request;
      await this.usersService.createUser(body);
      return this.successResponse({},"User registered successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.VERIFY_REGISTER_OTP)
  async verifyRegisterOtp(@Payload() request) {
    try {
      this.pagination = false;
      this.collection = true;
      this.request = request;
      let body = request.body;
      const user = await this.usersService.verifyOtp(body);
      return this.successResponse(user,"OTP verified successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.VERIFY_FORGOT_OTP)
  async verifyForgotOtp(@Payload() request) {
    try {
      this.pagination = false;
      this.collection = false;
      this.request = request;
      let data = request.body;
      data.type = API_TOKEN_TYPES.RESET;
      const user = await this.usersService.verifyOtp(data);

      return this.successResponse({token: user.api_token},"OTP verified successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.RESET_PASSWORD)
  async resetPassword(@Payload() request) {
    try {
      this.pagination = false;
      this.collection = false;
      this.request = request;
      await this.usersService.resetPassword(request);
      return this.successResponse({},"Password Reset successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.RESEND_OTP)
  async resendOtp(@Payload() request) {
    try {
      this.pagination = false;
      this.collection = false;
      this.request = request;
      let data = request.body;
      const user = await this.usersService.resendOtp(data);

      return this.successResponse(user,"OTP Send successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }


  @MessagePattern(USER_MESSAGE_PATTERNS.CHANGE_PASSWORD)
  async changePassword(@Payload() request) {
    try {
      this.pagination = false;
      this.collection = false;
      this.request = request;
      await this.usersService.changePassword(request);
      return this.successResponse({},"Password Updated successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.VERIFY_TOKEN)
  async verifyAuthToken(@Payload() data: {token: string, type: string}) {
    try {
      const verifyToken = await this.userApiTokensService.verifyToken(data.token,data.type);
      if (!verifyToken){
        return false;
      }
      const user = await this.usersService.showRecord(verifyToken.user_id);
      return user;
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.UPDATE_PROFILE)
  async updateProfile(@Payload() request) {
    try {
      this.pagination = false;
      this.collection = true;
      this.request = request;
      const user = await this.usersService.updateRecord(request.user.id,request.body);
      return this.successResponse(user,"User Updated successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
  @MessagePattern(USER_MESSAGE_PATTERNS.PROFILE)
  async profile(@Payload() request) {
    try {
      this.pagination = false;
      this.collection = true;
      this.request = request;
      const user = await this.usersService.showRecord(request.user.id);
      return this.successResponse(user,"User retrieved successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
  @MessagePattern(USER_MESSAGE_PATTERNS.LOGOUT)
  async logout(@Payload() request) {
    try {
      this.pagination = false;
      this.collection = false;
      this.request = request;
      const user = await this.usersService.logout(request.user.id);
      return this.successResponse(user,"Logout successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.GET_ALL_USERS)
  async getAll(@Payload() request) {
    try {
      this.request = request;
      const users = await this.usersService.getRecords(request);
      return this.successResponse(users,"users retrieved successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
}
