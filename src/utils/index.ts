import jwt, { JwtPayload } from "jsonwebtoken";
import { envConfig } from "../config";
import slugify from "slugify";

export const generateToken = (payload: JwtPayload) => {
	// const token = jwt.sign(payload, envConfig.jwt_secret!, {
	// 	expiresIn,
	// });

	const token = jwt.sign(payload, envConfig.jwt_secret!, {
		expiresIn: "2d",
	});
	return token;
};

export const generateSlug = (payload: string) => {
	const slug = slugify(payload, {
		lower: true,
		trim: true,
	});

	return slug;
};
