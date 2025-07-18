import { JwtPayload } from "jsonwebtoken";
import { comparePassword, hashPassword } from "../../utils/checkPassword";
import CustomError from "../../utils/CustomError";
import { User } from "../user/user.model";
import { IChangePassword, IRegisterUser } from "./auth.interface";
import { generateToken } from "../../utils";
import { envConfig } from "../../config";
import jwt from "jsonwebtoken";
const registerUser = async (payload: IRegisterUser) => {
	const user = await User.findOne({ email: payload.email });

	if (user) {
		throw new CustomError(302, "Email already exist");
	}
	//create doc
	const res = await User.create(payload);

	return {
		id: res._id,
		name: res.name,
		email: res.email,
	};
};

const loginUser = async (payload: Omit<IRegisterUser, "name">) => {
	//check user
	const user = await User.findOne({ email: payload.email, isDeleted: false });
	if (!user) {
		throw new CustomError(404, "Invalid credentials");
	}

	const validPassword = await comparePassword(
		payload.password,
		user.password
	);

	if (!validPassword) {
		throw new CustomError(400, "Invalid credentials");
	}

	const tokenPayload = {
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role,
	} as JwtPayload;

	const accessToken = generateToken(
		tokenPayload,
		envConfig.access_token_secret as string,
		envConfig.access_token_expire
	);

	const refreshToken = generateToken(
		tokenPayload,
		envConfig.refresh_token_secret as string,
		envConfig.refresh_token_expire
	);
	return {
		accessToken,
		refreshToken,
	};
};

const changePassword = async (id: string, payload: IChangePassword) => {
	const user = await User.findById(id);

	if (!user) {
		throw new CustomError(404, "User not found");
	}

	if (payload.newPassword !== payload.confirmPassword) {
		throw new CustomError(400, "Password does not match");
	}

	const matchPassword = await comparePassword(
		payload.oldPassword,
		user.password
	);

	if (!matchPassword) {
		throw new CustomError(400, "Invalid credentials");
	}

	const isSame = await comparePassword(payload.newPassword, user.password);

	if (isSame) {
		throw new CustomError(
			400,
			"New password must be different from current password"
		);
	}

	const hashed = await hashPassword(payload.newPassword);

	await User.findByIdAndUpdate(
		id,
		{
			$set: {
				password: hashed,
			},
		},
		{ new: true, runValidators: true }
	);
};

const getRefreshToken = async (token: string) => {
	if (!token) {
		throw new CustomError(401, "You are un authorized");
	}
	const verifyData = jwt.verify(
		token,
		envConfig.refresh_token_secret as string
	) as JwtPayload;

	const user = await User.findById(verifyData.id);
	const isDeleted = user?.isDeleted;

	if (!user) {
		throw new CustomError(404, "No user found");
	}
	if (isDeleted) {
		throw new CustomError(400, "Sorry, user is deleted");
	}

	const tokenPayload = {
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role,
	} as JwtPayload;

	const accessToken = generateToken(
		tokenPayload,
		envConfig.access_token_secret as string,
		envConfig.access_token_expire
	);

	return { accessToken };
};

export const authServices = {
	registerUser,
	loginUser,
	changePassword,
	getRefreshToken,
};
