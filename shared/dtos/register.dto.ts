import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    mobile_no: string;

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    zipcode?: string;

    @IsOptional()
    @IsString()
    latitude?: string;

    @IsOptional()
    @IsString()
    longitude?: string;

    @IsOptional()
    @IsNumber()
    hide_name?: string;

}