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
const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await enrollmentServices.getAllFromDB(req.query as {});

	sendResponse(res, {
		statusCode: 200,
		message: "Enrolled doc fetched successfully",
		result: result,
	});
});
const myEnrollment = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.user;
	const result = await enrollmentServices.myEnrollment(id);

	sendResponse(res, {
		statusCode: 200,
		message: "Enrolled doc fetched successfully",
		result: result,
	});
});

export const enrollmentController = {
	createIntoDB,
	getAllFromDB,
	myEnrollment,
};
