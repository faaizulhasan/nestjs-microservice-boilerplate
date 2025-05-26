export class UserResource {
    static toResponse(record,request) {
        return {
            id: record.id,
            user_type: record.user_type,
            first_name: record.first_name,
            last_name: record.last_name,
            email: record.email,
            mobile_no: record.mobile_no,
            address: record.address,
            country: record.country,
            city: record.city,
            state: record.state,
            zipcode: record.zipcode,
            latitude: record.latitude,
            longitude: record.longitude,
            image_url: record.image_url,
            stripe_customer_id: record.stripe_customer_id,
            connect_account_id: record.connect_account_id,
            transfer_capabilities: record.transfer_capabilities,
            is_email_verify: record.is_email_verify,
            is_mobile_verify: record.is_mobile_verify,
            login_type: record.login_type,
            is_activated: record.is_activated,
            is_blocked: record.is_blocked,
            hide_name: record.hide_name,
            api_token: record?.api_token || undefined,
            push_notification: record.push_notification,
            created_at: record.createdAt
        };
    }
}
