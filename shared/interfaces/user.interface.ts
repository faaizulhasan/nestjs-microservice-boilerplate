export interface UserInterface {
    user_type: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_no: string;
    password: string;
    address?: string;
    coordinates?: [number, number];
    stripe_customer_id?: string;
    connect_account_id?: string;
    transfer_capabilities: number;
    status: number;
    is_email_verify: number;
    email_verifyAt?: string;
    is_mobile_verify: number;
    mobile_verifyAt?: string;
    login_type?: string;
    platform_type?: string;
    platform_id?: string;
    is_activated: number;
    is_blocked: number;
    push_notification: number;
}
export type UserCreationAttributes = Omit<
    UserInterface,
    | 'id'
    | 'stripe_customer_id'
    | 'connect_account_id'
    | 'transfer_capabilities'
    | 'status'
    | 'is_email_verify'
    | 'email_verifyAt'
    | 'is_mobile_verify'
    | 'mobile_verifyAt'
    | 'login_type'
    | 'platform_type'
    | 'platform_id'
    | 'is_activated'
    | 'is_blocked'
    | 'push_notification'
    | 'coordinates'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    >;