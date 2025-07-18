"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.envConfig = {
    port: 5000,
    salt_round: 10,
    mongo_uri: process.env.MONGO_URI,
    node_env: process.env.NODE_ENV,
    front_end_url: process.env.FRONT_END_URL,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    access_token_expire: process.env.ACCESS_TOKEN_EXPIRE,
    refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRE,
    //stripe key
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_web_secret: process.env.STRIPE_WEBHOOK_SECRET,
};
