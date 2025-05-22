import {CanActivate, ExecutionContext, Inject, Injectable,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {API_TOKEN_TYPES, JWT_SECRET, MICRO_SERVICES, USER_MESSAGE_PATTERNS} from "../../../shared/constants";
import {ClientProxy} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";
import {CustomUnauthorizedException} from "../../../shared/exceptions/custom-unauthorized.exception";

@Injectable()
export class ResetAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        @Inject(MICRO_SERVICES.USERS_SERVICE) private client: ClientProxy
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new CustomUnauthorizedException("Token Not provided");
        }
        try {
            await this.jwtService.verifyAsync(
                token,
                {
                    secret: JWT_SECRET
                }
            );
            let user = await lastValueFrom(this.client.send(USER_MESSAGE_PATTERNS.VERIFY_TOKEN, {token: token,type: API_TOKEN_TYPES.RESET}));
            if (!user){
                throw new CustomUnauthorizedException("Invalid Token");
            }
            request['user'] = user;
        } catch(err) {
            throw new CustomUnauthorizedException(err.message);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
