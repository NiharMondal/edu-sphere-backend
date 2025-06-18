import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const envConfig = {
	port: 5000,
	salt_round: 10,
	mongo_uri: process.env.MONGO_URI,
	node_env: process.env.NODE_ENV,
	front_end_url: process.env.FRONT_END_URL,
	jwt_secret: process.env.JWT_SECRET,
	jwt_expire: process.env.JWT_EXPIRE,
	//stripe key
	stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
	stripe_secret_key: process.env.STRIPE_SECRET_KEY,
	stripe_web_secret: process.env.STRIPE_WEBHOOK_SECRET,
};
