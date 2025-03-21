import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await userServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "User fetched successfully",
		result: result,
	});
});

const getInstructors = asyncHandler(async (req: Request, res: Response) => {
	const result = await userServices.getInstructors();

	sendResponse(res, {
		statusCode: 200,
		message: "Instructors fetched successfully",
		result: result,
	});
});

export const userController = { getInstructors, getAllFromDB };
