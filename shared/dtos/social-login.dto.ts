import {IsEmail, IsIn, IsNotEmpty, IsString, IsOptional} from 'class-validator';

export class SocialLoginDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsString()
    @IsIn(["google","facebook","instagram"])
    platform_type: string;

    @IsString()
    @IsNotEmpty()
    platform_id: string;

    @IsString()
    @IsIn(['web', 'android', 'ios'])
    device_type: string;

    @IsString()
    @IsNotEmpty()
    device_token: string;

}