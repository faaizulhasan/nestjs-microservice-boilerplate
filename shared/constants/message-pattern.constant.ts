export const USER_MESSAGE_PATTERNS = {
    SEND_MAIL: "send_email",
    LOGIN: "auth_login",
    REGISTER: "auth_register",
    CREATE_USER: "create_user",
    GET_ALL_USERS: "get_all_users",
    GET_USER_BY_ID: "get_user_by_id",
    GET_USER_DEVICE_TOKEN: "get_user_device_token",
    VERIFY_REGISTER_OTP: "verify_register_otp",
    VERIFY_FORGOT_OTP: "verify_forgot_otp",
    RESEND_OTP: "resend_otp",
    RESET_PASSWORD: "reset_password",
    VERIFY_TOKEN: "verify_token",
    CHANGE_PASSWORD: "change_password",
    UPDATE_PROFILE: "update_profile",
    PROFILE: "profile",
    LOGOUT: "logout",
    DELETE_ACCOUNT: "delete_account",
    SOCIAL_LOGIN: "social_login",
    UPDATE_DEVICE_TOKEN: "update_device_token",
    RETURN_CONNECT_ACCOUNT_FAILURE: "return_connect_account_failure",
    RETURN_CONNECT_ACCOUNT: "return_connect_account"
};

export const NOTIFICATION_MESSAGE_PATTERNS = {
    GET_ALL_NOTIFICATIONS: "get_all_notifications",
    GET_UNREAD_COUNT: "get_unread_count",
    MARK_ALL_READ: "mark_all_read",
    MARK_SINGLE_READ: "mark_single_read",
    SEND_NOTIFICATION: "send_notification"
}
export const SETTING_MESSAGE_PATTERNS = {
    GET_SETTING_BY_TYPE: "get_setting_by_type",
    UPDATE_SETTING: "update_setting"
}

export const PAYMENT_MESSAGE_PATTERNS = {
    CREATE_USER_CARD: "create_user_card",
    GET_ALL_USER_CARDS: "get_all_user_cards",
    GET_USER_CARD_BY_ID: "get_user_card_by_id",
    DELETE_USER_CARD: "delete_user_card",
    GET_USER_WALLET: "get_user_wallet",
    UPDATE_USER_WALLET: "update_user_wallet",
    WITHDRAW_AMOUNT: "withdraw_amount"
}

export const STRIPE_MESSAGE_PATTERNS = {
    CREATE_CUSTOMER: "create_customer",
    GENERATE_CONNECT_ACCOUNT_LINK: "generate_connect_account_link",
    CHECK_CAPABILITY: "check_capability"
}

