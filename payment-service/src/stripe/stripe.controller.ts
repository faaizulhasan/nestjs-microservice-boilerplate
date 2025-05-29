import { Controller } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { STRIPE_MESSAGE_PATTERNS } from '../../../shared/constants/message-pattern.constant';

@Controller('stripe')
export class StripeController {

    constructor(private stripeService: StripeService) {}

    @MessagePattern(STRIPE_MESSAGE_PATTERNS.CREATE_CUSTOMER)
    async createCustomer(@Payload() payload: {email: string}) {
        return this.stripeService.addCustomer(payload.email);
    }
}
