import {IsNotEmpty, IsString} from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    current_password: string;

    @IsString()
    @IsNotEmpty()
    new_password: string;

    @IsString()
    @IsNotEmpty()
    confirm_password: string;
}