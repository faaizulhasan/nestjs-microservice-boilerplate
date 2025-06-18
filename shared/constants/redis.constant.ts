import { config } from "dotenv";

config();

export const REDIS_CREDENTIALS = {
    host: "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    //password: "",
    keyPrefix: "dropn:"
};
