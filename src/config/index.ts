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
};
