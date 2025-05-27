import {IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
    @IsNumber()
    @IsNotEmpty()
    user_id: number;
    
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;
    
    @IsString()
    @IsOptional()
    type?: string;
}