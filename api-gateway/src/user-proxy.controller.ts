import {Body, Controller, Delete, Get, Inject, Patch, Post, Request, UseGuards} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {LoginDto} from "../../shared/dtos/login.dto";
import {RegisterDto} from "../../shared/dtos/register.dto";
import {MICRO_SERVICES, USER_MESSAGE_PATTERNS} from "../../shared/constants";
import {VerifyOtpDto} from "../../shared/dtos/verify-otp.dto";
import {ResendOtpDto} from "../../shared/dtos/resend-otp.dto";
import {ResetPasswordDto} from "../../shared/dtos/reset-password.dto";
import {ResetAuthGuard} from "./guards/reset-auth-guard";
import {ChangePasswordDto} from "../../shared/dtos/change-password.dto";
import {ApiAuthGuard} from "./guards/api-auth-guard";

@Controller('user')
export class UserProxyController {
    constructor(@Inject(MICRO_SERVICES.USERS_SERVICE) private client: ClientProxy) {}

    @Post('login')
    login(@Request() req, @Body() dto: LoginDto) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.LOGIN, payload);
    }

    @Post('register')
    async register(@Request() req, @Body() dto: RegisterDto) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.REGISTER, payload);
    }

    @Post('verify-register-otp')
    async verifyRegisterOtp(@Request() req, @Body() dto: VerifyOtpDto) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.VERIFY_REGISTER_OTP, payload);
    }
    @Post('verify-forgot-otp')
    async verifyForgotOtp(@Request() req, @Body() dto: VerifyOtpDto) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.VERIFY_FORGOT_OTP, payload);
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
    async resendOtp(@Request() req, @Body() dto: ResendOtpDto) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.RESEND_OTP, payload);
    }

    @UseGuards(ApiAuthGuard)
    @Post('change-password')
    async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.CHANGE_PASSWORD, payload);
    }

    @UseGuards(ApiAuthGuard)
    @Patch('update-profile')
    async updateProfile(@Request() req, @Body() body) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.UPDATE_PROFILE, payload);
    }
    @UseGuards(ApiAuthGuard)
    @Get('profile')
    async profile(@Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.PROFILE, payload);
    }
    @UseGuards(ApiAuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.LOGOUT, payload);
    }
    @UseGuards(ApiAuthGuard)
    @Delete('delete-account')
    async deleteAccount(@Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.DELETE_ACCOUNT, payload);
    }

    @Get('all-users')
    async getAll(@Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.GET_ALL_USERS, payload);
    }

}