import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { enrollmentServices } from "./enrollment.service";
import sendResponse from "../../utils/sendResponse";

const createIntoDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await enrollmentServices.createIntoDB(req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "Course enrolled successfully",
		result: result,
	});
});

export const enrollmentController = { createIntoDB };
