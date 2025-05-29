export class UserWalletResource {
    static toResponse(record, request) {
        return {
            wallet_amount: record.wallet_amount
        };
    }
}
