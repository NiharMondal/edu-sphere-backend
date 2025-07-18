import jwt, { JwtPayload } from "jsonwebtoken";
import slugify from "slugify";
import CustomError from "./CustomError";

export const generateToken = (
	payload: JwtPayload,
	secret: string,
	expiresIn: any
) => {
	const token = jwt.sign(payload, secret, {
		expiresIn: expiresIn,
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
