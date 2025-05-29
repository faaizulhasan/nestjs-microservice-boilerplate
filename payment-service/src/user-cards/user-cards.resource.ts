export class UserCardResource {
    static toResponse(record, request) {
        return {
            id: record.id,
            user_id: record.user_id,
            payment_method_id: record.payment_method_id,
            name: record.name,
            brand: record.brand,
            expiry_month: record.expiry_month,
            expiry_year: record.expiry_year,
            last_four: record.last_four,
            created_at: record.createdAt
        };
    }
}
