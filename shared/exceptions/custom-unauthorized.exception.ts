import {UnauthorizedException} from '@nestjs/common';

export class CustomUnauthorizedException extends UnauthorizedException {
    constructor(message = 'Invalid or expired token') {
        super({
            statusCode: 401,
            status: false,
            error: 'Unauthorized',
            message,
        });
    }
}
