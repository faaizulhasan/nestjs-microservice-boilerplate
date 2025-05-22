import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import {Injectable} from '@nestjs/common';
import {UsersService} from '../../users-service/src/services/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly usersService: UsersService) {}

    async validate(email: string, _args: ValidationArguments): Promise<boolean> {
        const user = await this.usersService.findUserByEmail(email);
        return !user; // Return true if email does NOT exist
    }

    defaultMessage(args: ValidationArguments) {
        return `Email "${args.value}" already exists.`;
    }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailUniqueConstraint,
        });
    };
}
