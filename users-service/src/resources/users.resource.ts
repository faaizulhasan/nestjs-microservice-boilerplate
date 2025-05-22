export class UserResource {
    static toResponse(record) {
        return {
            id: record.id,
            user_type: record.user_type,
            first_name: record.first_name,
            last_name: record.last_name,
            email: record.email,
            mobile_no: record.mobile_no,
            address: record.address,
            coordinates: record.coordinates,
            stripe_customer_id: record.stripe_customer_id,
            connect_account_id: record.connect_account_id,
            transfer_capabilities: record.transfer_capabilities,
            is_email_verify: record.is_email_verify,
            is_mobile_verify: record.is_mobile_verify,
            login_type: record.login_type,
            is_activated: record.is_activated,
            is_blocked: record.is_blocked,
            api_token: record?.api_token || undefined,
            push_notification: record.push_notification,
            created_at: record.createdAt
        };
    }
}
