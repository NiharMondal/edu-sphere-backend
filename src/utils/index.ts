import jwt, { JwtPayload } from "jsonwebtoken";
import { envConfig } from "../config/index";
import slugify from "slugify";
import CustomError from "./CustomError";

export const generateToken = (payload: JwtPayload) => {
	const token = jwt.sign(payload, envConfig.jwt_secret!, {
		expiresIn: "10d",
	});
	return token;
};

export const generateSlug = (payload: string) => {
	if (!payload) {
		throw new CustomError(400, "Slug payload is not provided!");
	}
	const slug = slugify(payload, {
		lower: true,
		trim: true,
	});

	return slug;
};
