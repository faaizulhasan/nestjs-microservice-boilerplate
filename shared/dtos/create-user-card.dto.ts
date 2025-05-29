import {IsNotEmpty, IsString} from 'class-validator';

export class CreateUserCardDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    payment_method_id: string;
}