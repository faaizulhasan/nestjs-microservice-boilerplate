import { config } from "dotenv";

config();

export const REDIS_CREDENTIALS = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    keyPrefix: process.env.REDIS_KEY_PREFIX
};
