import {Body, Controller, Get, Inject, Post, Query, Request, UseGuards} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {LoginDto} from "../../shared/dtos/login.dto";
import {RegisterDto} from "../../shared/dtos/register.dto";
import {MICRO_SERVICES, USER_MESSAGE_PATTERNS} from "../../shared/constants";
import {VerifyOtpDto} from "../../shared/dtos/verify-otp.dto";
import {ResendOtpDto} from "../../shared/dtos/resend-otp.dto";
import {ResetPasswordDto} from "../../shared/dtos/reset-password.dto";
import {ResetAuthGuard} from "./guards/reset-auth-guard";

@Controller('user')
export class UserProxyController {
    constructor(@Inject(MICRO_SERVICES.USERS_SERVICE) private client: ClientProxy) {}

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.client.send(USER_MESSAGE_PATTERNS.LOGIN, dto);
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.client.send(USER_MESSAGE_PATTERNS.REGISTER, dto);
    }

    @Post('verify-register-otp')
    async verifyRegisterOtp(@Body() dto: VerifyOtpDto) {
        return this.client.send(USER_MESSAGE_PATTERNS.VERIFY_REGISTER_OTP, dto);
    }
    @Post('verify-forgot-otp')
    async verifyForgotOtp(@Body() dto: VerifyOtpDto) {
        return this.client.send(USER_MESSAGE_PATTERNS.VERIFY_FORGOT_OTP, dto);
    }
    @UseGuards(ResetAuthGuard)
    @Post('reset-password')
    async resetPassword(@Request() req,@Body() dto: ResetPasswordDto) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.RESET_PASSWORD, payload);
    }
    @Post('resend-otp')
    async resendOtp(@Body() dto: ResendOtpDto) {
        return this.client.send(USER_MESSAGE_PATTERNS.RESEND_OTP, dto);
    }
    @Get('all-users')
    async getAll(@Query() query) {
        return this.client.send(USER_MESSAGE_PATTERNS.GET_ALL_USERS, query);
    }

}