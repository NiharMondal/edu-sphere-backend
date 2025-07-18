import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { metaDataServices } from "./meta-data.service";

const generalInformation = asyncHandler(async (req: Request, res: Response) => {
	const data = await metaDataServices.generalInformation();

	sendResponse(res, {
		statusCode: 200,
		message: "General information fetched successfully",
		result: data,
	});
});
const revenue = asyncHandler(async (req: Request, res: Response) => {
	const data = await metaDataServices.revenue();

	sendResponse(res, {
		statusCode: 200,
		message: "Revenue fetched successfully",
		result: data,
	});
});

export const metaDataController = { generalInformation, revenue };
