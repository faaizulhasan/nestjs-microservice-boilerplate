import { config } from "dotenv";

config();

export const REDIS_CREDENTIALS = {
    host: "localhost",//"31.186.241.13",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    //password: "i2hxzVcAzP8xudyL0bRX",
    keyPrefix: "dropn:"
};
