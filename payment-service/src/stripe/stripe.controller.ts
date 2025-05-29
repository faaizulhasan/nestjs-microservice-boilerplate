import { Controller } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { STRIPE_MESSAGE_PATTERNS } from '../../../shared/constants/message-pattern.constant';
import { BaseController } from '../../../shared/base/base-controller';

@Controller('stripe')
export class StripeController extends BaseController {

    constructor(private stripeService: StripeService) {
        super(StripeService, null);
    }

    @MessagePattern(STRIPE_MESSAGE_PATTERNS.CREATE_CUSTOMER)
    async createCustomer(@Payload() payload: { email: string }) {
        return this.stripeService.addCustomer(payload.email);
    }
    @MessagePattern(STRIPE_MESSAGE_PATTERNS.CHECK_CAPABILITY)
    async checkCapability(@Payload() payload: { account_id: string }) {
        const accountInfo: any = await this.stripeService.getAccountInfo(payload.account_id);
        return accountInfo;
    }
    @MessagePattern(STRIPE_MESSAGE_PATTERNS.GENERATE_CONNECT_ACCOUNT_LINK)
    async generateConnectAccountLink(@Payload() request): Promise<any> {
        try {
            this.collection = false;
            this.pagination = false;
            this.request = request;
            const user = request.user;
            const accountLink = await this.stripeService.createAccountLink(user.id);
            return this.successResponse(accountLink, "Connect account link generated successfully");
        } catch (error) {
            return this.sendError(error.message);
        }
    }
}
