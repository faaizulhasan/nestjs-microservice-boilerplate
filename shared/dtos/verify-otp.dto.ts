import {IsEmail, IsIn, IsNotEmpty, IsString, ValidateIf,} from 'class-validator';

export class VerifyOtpDto {
    @ValidateIf(o => !o.mobile_no)
    @IsEmail()
    email?: string;

    @ValidateIf(o => !o.email)
    @IsString()
    @IsNotEmpty()
    mobile_no?: string;

    @IsString()
    @IsNotEmpty()
    otp: string;

    @IsString()
    @IsIn(['web', 'android', 'ios'])
    device_type: string;

    @IsString()
    @IsNotEmpty()
    device_token: string;
}
