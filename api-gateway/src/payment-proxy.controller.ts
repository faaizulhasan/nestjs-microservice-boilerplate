import { Body, Controller, Delete, Get, Inject, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { MICRO_SERVICES, PAYMENT_MESSAGE_PATTERNS } from "../../shared/constants";
import { ApiAuthGuard } from "./guards/api-auth-guard";
import { CreateUserCardDto } from "../../shared/dtos/create-user-card.dto";
import { Param } from "@nestjs/common";
@Controller('payment')
export class PaymentProxyController {
    constructor(@Inject(MICRO_SERVICES.PAYMENT_SERVICE) private client: ClientProxy) { }

    @UseGuards(ApiAuthGuard)
    @Get('/get-cards')
    async getAll(@Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(PAYMENT_MESSAGE_PATTERNS.GET_ALL_USER_CARDS, payload);
    }
    @UseGuards(ApiAuthGuard)
    @Post('/add-card')
    async create(@Body() body: CreateUserCardDto, @Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(PAYMENT_MESSAGE_PATTERNS.CREATE_USER_CARD, payload);
    }
    @UseGuards(ApiAuthGuard)
    @Delete('/delete-card/:id')
    async delete(@Param('id') id: string, @Request() req) {
        let payload = {
            body: req.body,
            query: req.query,
            params: req.params,
            user: req.user
        }
        return this.client.send(PAYMENT_MESSAGE_PATTERNS.DELETE_USER_CARD, payload);
    }
}