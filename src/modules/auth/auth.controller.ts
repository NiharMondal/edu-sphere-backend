import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

import { authServices } from "./auth.service";

//register user
const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const result = await authServices.registerUser(req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "User registered successfully",
		result: result,
	});
});

//register user
const loginUser = asyncHandler(async (req: Request, res: Response) => {
	const result = await authServices.loginUser(req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "User logged in successfully",
		result: result,
	});
});
export const authController = { registerUser, loginUser };
