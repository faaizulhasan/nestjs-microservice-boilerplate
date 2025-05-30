export class TransactionResource {
    static toResponse(record, request) {
        return {
            id: record.id,
            user_id: record.user_id,
            task_id: record.task_id,
            gateway_transaction_id: record.gateway_transaction_id,
            transaction_type: record.transaction_type,
            previous_amount: record.previous_amount,
            new_amount: record.new_amount,
            platform_fee: record.platform_fee,
            transaction_amount: record.transaction_amount,
            total_amount: record.total_amount,
            status: record.status,
            description: record.description,
            created_at: record.created_at
        };
    }
}
