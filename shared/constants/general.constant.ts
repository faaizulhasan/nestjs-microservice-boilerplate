export const BASE_URL = "http://localhost:3000/";
export const MICRO_SERVICES = {
    AUTH_SERVICE: "AUTH_SERVICE",
    MAILER_SERVICE: "MAILER_SERVICE",
    USERS_SERVICE: "USERS_SERVICE",
    NOTIFICATION_SERVICE: "NOTIFICATION_SERVICE",
    SETTING_SERVICE: "SETTING_SERVICE"
};
export const ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
    FUL_FILLER: "FUL_FILLER"
}
export const API_TOKEN_TYPES = {
    ACCESS: "ACCESS",
    RESET: 'RESET'
}

export const LOGIN_TYPE = {
    CUSTOM: "custom",
    SOCIAL: "social"
}
export const PER_PAGE_LIMIT = 20;

export const JWT_SECRET = "Drop%N%Secret@123$";
export const JWT_EXPIRY = "1d";