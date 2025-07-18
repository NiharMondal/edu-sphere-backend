import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { reviewServices } from "./review.service";
import sendResponse from "../../utils/sendResponse";
import { TQuery } from "../../type";

const createIntoDB = asyncHandler(async (req: Request, res: Response) => {
	const data = await reviewServices.createIntoDB(req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "Review created successfully",
		result: data,
	});
});

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const data = await reviewServices.getAllFromDB(req.query as TQuery);

	sendResponse(res, {
		statusCode: 200,
		message: "Reviews fetched successfully",
		result: data,
	});
});

const updateDoc = asyncHandler(async (req: Request, res: Response) => {
	const data = await reviewServices.updateDoc(req.params.id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Reviews updated successfully",
		result: data,
	});
});

const deleteDoc = asyncHandler(async (req: Request, res: Response) => {
	const data = await reviewServices.deleteDoc(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Review accepted successfully",
		result: data,
	});
});
const acceptReview = asyncHandler(async (req: Request, res: Response) => {
	const data = await reviewServices.acceptReview(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Review accepted successfully",
		result: data,
	});
});
const undoAccept = asyncHandler(async (req: Request, res: Response) => {
	const data = await reviewServices.undoAccept(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Removed form accepted review",
		result: data,
	});
});

export const reviewController = {
	createIntoDB,
	getAllFromDB,
	acceptReview,
	deleteDoc,
	updateDoc,
	undoAccept,
};
