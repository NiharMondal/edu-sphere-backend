import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { reviewServices } from "./review.service";
import sendResponse from "../../utils/sendResponse";

const createIntoDB = asyncHandler(async (req: Request, res: Response) => {
	const data = await reviewServices.createIntoDB(req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "Data created successfully",
		result: data,
	});
});

export const reviewController = { createIntoDB };
