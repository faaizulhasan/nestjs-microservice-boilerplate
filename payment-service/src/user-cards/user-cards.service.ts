import { Injectable } from '@nestjs/common';
import { UserCard } from './user-cards.model';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../../../shared/base/base-service';
import { StripeService } from '../stripe/stripe.service';
import { raw } from 'mysql2';
@Injectable()
export class UserCardsService extends BaseService {

    constructor(
        @InjectModel(UserCard) private userCardModel: any,
        private readonly stripeService: StripeService
    ) {
        super(UserCard);
    }

    async createRecord(request: any) {
        const { name, payment_method_id } = request.body;
        const user = request.user;
        if(!user.stripe_customer_id){
            throw new Error("Stripe customer id not found");
        }
        const card: any = await this.stripeService.attachPaymentMethodWithCustomer(payment_method_id, user.stripe_customer_id);
        const data = {
            user_id: user.id,
            payment_method_id: card.id,
            card_id: card.id,
            name: name,
            brand: card.card.brand,
            expiry_month: card.card.exp_month,
            expiry_year: card.card.exp_year,
            last_four: card.card.last4,
            fingerprint: card.card.fingerprint
        }
        const userCard = await this.userCardModel.create(data);
        return userCard.toJSON();
    }
    async getAllRecords(request: any) {
        const user = request.user;
        const userCards = await this.userCardModel.findAll({
            where: { user_id: user.id },
            order: [['id', 'DESC']],
            raw: true
        });
        return userCards;
    }   
    async deleteRecord(request: any) {
        const user = request.user;
        const userCard = await this.userCardModel.findOne({
            where: { id: request.params.id, user_id: user.id },
            raw: true
        });
        if(!userCard){
            throw new Error("User card not found");
        }
        await this.stripeService.detachPaymentMethodWithCustomer(userCard.payment_method_id);
        await this.userCardModel.destroy({
            where: { id: request.params.id, user_id: user.id },
            force: true
        });
        return true;
    }   
}
