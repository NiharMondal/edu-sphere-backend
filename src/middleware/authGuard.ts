import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/CustomError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envConfig } from "../config";
import { User } from "../modules/user/user.model";

export const authGuard = (...roles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const token = req.headers.authorization;

		try {
			if (!token) {
				throw new CustomError(401, "Not authorized");
			}

			const decodeToken = jwt.verify(
				token,
				envConfig.jwt_secret as string
			) as JwtPayload;

			const { id, role } = decodeToken;
			const user = await User.findById(id);
			if (!user) {
				throw new CustomError(401, "Not authorized");
			}

			if (token && !roles.includes(role)) {
				throw new CustomError(401, "Not authorized");
			}

			req.user = decodeToken;

			next();
		} catch (error) {
			next(error);
		}
	};
};
