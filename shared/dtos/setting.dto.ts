import {IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SettingDto {
    
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    text: string;
    
    @IsOptional()
    @IsString()
    url?: string;

}