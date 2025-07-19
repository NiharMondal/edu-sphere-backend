import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

import { authServices } from "./auth.service";
import { envConfig } from "../../config";

//register user
const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const result = await authServices.registerUser(req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "User registered successfully",
		result: result,
	});
});

//login user
const loginUser = asyncHandler(async (req: Request, res: Response) => {
	const result = await authServices.loginUser(req.body);
	const { accessToken, refreshToken } = result;

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
		sameSite: "none",
		path: "/",
	});

	sendResponse(res, {
		statusCode: 200,
		message: "User logged in successfully",
		result: { accessToken },
	});
});
const changePassword = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.user;
	const result = await authServices.changePassword(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Password changed successfully",
		result: result,
	});
});

const getRefreshToken = asyncHandler(async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken;

	const result = await authServices.getRefreshToken(refreshToken);

	sendResponse(res, {
		statusCode: 200,
		message: "New access token retrieved successfully",
		result: result,
	});
});

const loggedOut = asyncHandler(async (req: Request, res: Response) => {
	res.clearCookie("accessToken", {
		path: "/",
		sameSite: "none",
		secure: envConfig.node_env === "production",
		httpOnly: false,
	});

	res.clearCookie("refreshToken", {
		path: "/",
		sameSite: "none",
		secure: true,
		httpOnly: true,
	});

	sendResponse(res, {
		statusCode: 200,
		message: "Logged out successfully",
		result: {
			message: "Ok",
		},
	});
});
export const authController = {
	registerUser,
	loginUser,
	changePassword,
	getRefreshToken,

	loggedOut,
};
