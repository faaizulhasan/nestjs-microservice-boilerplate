import {IsEmail, IsIn, IsNotEmpty, IsString} from 'class-validator';

export class SocialLoginDto {
    @IsEmail()
    email?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

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