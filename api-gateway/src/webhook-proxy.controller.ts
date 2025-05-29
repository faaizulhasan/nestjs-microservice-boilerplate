import { Body, Controller, Delete, Get, Inject, Patch, Post, Render, Request, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { MICRO_SERVICES, USER_MESSAGE_PATTERNS } from "../../shared/constants";

@Controller('webhook')
export class WebhookProxyController {
    constructor(@Inject(MICRO_SERVICES.USERS_SERVICE) private client: ClientProxy) {}
    @Get('return-connect-account-failure')
    @Render('stripe-connect-failure')
    async returnConnectAccountFailure(@Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(USER_MESSAGE_PATTERNS.RETURN_CONNECT_ACCOUNT_FAILURE, payload);
    }

    @Get('return-connect-account')
    @Render('stripe-connect-success')
    async returnConnectAccount(@Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        console.log("payload:",payload);
        return this.client.send(USER_MESSAGE_PATTERNS.RETURN_CONNECT_ACCOUNT, payload);
    }  
   

}