import {Controller} from '@nestjs/common';
import {UsersService} from './services/users.service';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {API_TOKEN_TYPES, USER_MESSAGE_PATTERNS} from "../../shared/constants";
import {RegisterDto} from "../../shared/dtos/register.dto";
import {LoginDto} from "../../shared/dtos/login.dto";
import {UserResource} from "./resources/users.resource";
import {BaseController} from "../../shared/base/base-controller";
import {VerifyOtpDto} from "../../shared/dtos/verify-otp.dto";
import {UserApiTokensService} from "./services/user-api-tokens.service";
import {UserOtpService} from "./services/user-otps.service";
import {ResendOtpDto} from "../../shared/dtos/resend-otp.dto";
import {ResetPasswordDto} from "../../shared/dtos/reset-password.dto";

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
  async login(@Payload() dto: LoginDto) {
    try {
      this.pagination = false;
      const user = await this.usersService.validateUser(dto.email,dto.password);
      let data = {
        user_id: user.id,
        type: API_TOKEN_TYPES.ACCESS,
        device_type: dto.device_type,
        device_token: dto.device_token
      }
      if (!user.is_email_verify || !user.is_mobile_verify){
        /* create otp and send mail*/
        await this.userOtpService.create(dto);
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
  async register(@Payload() data: RegisterDto) {
    try {
      await this.usersService.createUser(data);
      this.collection = false;
      this.pagination = false;
      return this.successResponse({},"User registered successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
  @MessagePattern(USER_MESSAGE_PATTERNS.VERIFY_REGISTER_OTP)
  async verifyRegisterOtp(@Payload() data: VerifyOtpDto) {
    try {
      const user = await this.usersService.verifyOtp(data);
      this.pagination = false;
      return this.successResponse(user,"OTP verified successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
  @MessagePattern(USER_MESSAGE_PATTERNS.VERIFY_FORGOT_OTP)
  async verifyForgotOtp(@Payload() data) {
    try {
      data.type = API_TOKEN_TYPES.RESET;
      const user = await this.usersService.verifyOtp(data);
      this.pagination = false;
      this.collection = false;
      return this.successResponse({token: user.api_token},"OTP verified successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.RESET_PASSWORD)
  async resetPassword(@Payload() data: ResetPasswordDto) {
    try {
      this.pagination = false;
      this.collection = false;
      return this.successResponse({},"Password Reset successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.RESEND_OTP)
  async resendOtp(@Payload() data: ResendOtpDto) {
    try {
      const user = await this.usersService.resendOtp(data);
      this.pagination = false;
      this.collection = false;
      return this.successResponse(user,"OTP Send successfully")
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

  @MessagePattern(USER_MESSAGE_PATTERNS.GET_ALL_USERS)
  async getAll(@Payload() query) {
    try {
      const users = await this.usersService.getRecords(query);
      this.extra_payload = {...this.extra_payload,query: query};
      return this.successResponse(users,"users retrieved successfully")
    }catch (e) {
      console.log(e);
      return this.sendError(e.message);
    }
  }
}
