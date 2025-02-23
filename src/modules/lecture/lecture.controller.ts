import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { lectureServices } from "./lecture.service";

const createIntoDB = asyncHandler(async (req: Request, res: Response) => {
	const { moduleId } = req.params;
	const result = await lectureServices.createIntoDB(moduleId, req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "Lecture created successfully",
		result: result,
	});
});

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await lectureServices.getAllFromDB(req.query as {});

	sendResponse(res, {
		statusCode: 200,
		message: "Lecture fetched successfully",
		result: result,
	});
});

const getById = asyncHandler(async (req: Request, res: Response) => {
	const result = await lectureServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Lecture fetched successfully",
		result: result,
	});
});

const updateDoc = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await lectureServices.updateDoc(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Lecture updated successfully",
		result: result,
	});
});

const deleteDoc = asyncHandler(async (req: Request, res: Response) => {
	const result = await lectureServices.deleteDoc(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Lecture deleted successfully",
		result: result,
	});
});

export const lectureController = {
	createIntoDB,
	getAllFromDB,
	getById,

	updateDoc,
	deleteDoc,
};
