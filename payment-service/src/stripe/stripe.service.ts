import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { BASE_URL } from '../../../shared/constants';
@Injectable()
export class StripeService  {

    private stripe: Stripe;

  constructor(private configService: ConfigService,) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!);
  }

  async setupIntent() {
    return this.stripe.setupIntents.create();
  }

  async addCustomer(email: string) {
    return this.stripe.customers.create({ email });
  }

  async attachPaymentMethodWithCustomer(paymentMethodId: string, customerId: string) {
    return this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  async detachPaymentMethodWithCustomer(paymentMethodId: string) {
    return this.stripe.paymentMethods.detach(paymentMethodId);
  }

  async retrievePaymentMethod(paymentMethodId: string) {
    return this.stripe.paymentMethods.retrieve(paymentMethodId);
  }

  async createPaymentIntent(customerId: string, paymentMethodId: string, amount: number) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      payment_method: paymentMethodId,
      customer: customerId,
    });
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
    return this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
  }

  async chargeCard(customerId: string, paymentMethodId: string, amount: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      payment_method: paymentMethodId,
      customer: customerId,
    });

    return this.stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: paymentMethodId,
    });
  }

  async chargeThroughConnectedAccount(connectedAccountId: string, amount: number) {
    return this.stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      source: connectedAccountId,
    });
  }

  async createAccountLink(userId: string, stripeConnectAccountId?: string) {
    let accountId = stripeConnectAccountId;

    if (!accountId) {
      const account = await this.stripe.accounts.create({ type: 'express' });
      accountId = account.id;
    }

    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${BASE_URL}webhook/return-connect-account-failure?user_id=${userId}`,
      return_url: `${BASE_URL}webhook/return-connect-account?user_id=${userId}&account_id=${accountId}`,
      type: 'account_onboarding',
    });

    return { account_link: accountLink, accountId };
  }

  async getAccountInfo(accountId: string) {
    return this.stripe.accounts.retrieve(accountId);
  }

  async transfer(amount: number, connectAccountId: string) {
    return this.stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      destination: connectAccountId,
    });
  }

  async payout(amount: number, connectAccountId: string) {
    return this.stripe.payouts.create(
      {
        amount: Math.round(amount * 100),
        currency: 'usd',
      },
      { stripeAccount: connectAccountId }
    );
  }

  async refund(amount: number, paymentIntentId: string) {
    return this.stripe.refunds.create({
      amount: Math.round(amount * 100),
      payment_intent: paymentIntentId,
    });
  }

  async getBalance() {
    return this.stripe.balance.retrieve();
  }

}
