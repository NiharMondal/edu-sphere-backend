import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const envConfig = {
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
