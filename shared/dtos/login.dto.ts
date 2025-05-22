import {IsEmail, IsIn, IsNotEmpty, IsString} from 'class-validator';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsIn(['web', 'android', 'ios'])
    device_type: string;

    @IsString()
    @IsNotEmpty()
    device_token: string;
}