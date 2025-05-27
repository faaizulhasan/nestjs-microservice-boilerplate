import {IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SettingDto {
    
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    text: string;

}