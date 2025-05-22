import {Body, Controller, Get, Inject, Post, Query} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {LoginDto} from "../../shared/dtos/login.dto";
import {RegisterDto} from "../../shared/dtos/register.dto";
import {MESSAGE_PATTERNS, MICRO_SERVICES} from "../../shared/constants";
import {VerifyOtpDto} from "../../shared/dtos/verify-otp.dto";

@Controller('user')
export class UserProxyController {
    constructor(@Inject(MICRO_SERVICES.USERS_SERVICE) private client: ClientProxy) {}

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.client.send(MESSAGE_PATTERNS.AUTH_LOGIN, dto);
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.client.send(MESSAGE_PATTERNS.AUTH_REGISTER, dto);
    }

    @Post('verify-register-otp')
    async verifyRegisterOtp(@Body() dto: VerifyOtpDto) {
        return this.client.send(MESSAGE_PATTERNS.VERIFY_REGISTER_OTP, dto);
    }
    @Get('all-users')
    async getAll(@Query() query) {
        return this.client.send(MESSAGE_PATTERNS.GET_ALL_USERS, query);
    }

}