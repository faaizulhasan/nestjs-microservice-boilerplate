import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
    providers: [StripeService], 
    exports: [StripeService],
    controllers: [StripeController]
})
export class StripeModule {}