import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { lectureServices } from "./lecture.service";
import { TQuery } from "../../type";

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
		meta: result.meta,
		result: result.lectures,
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

const assignedLectureToInstructor = asyncHandler(
	async (req: Request, res: Response) => {
		const user = req.user;
		const query = req.query;
		const result = await lectureServices.assignedLectureToInstructor(
			user.id,
			query as TQuery
		);

		sendResponse(res, {
			statusCode: 200,
			message: "Assigned Lecture fetched successfully",
			result: result.lectures,
			meta: result.meta,
		});
	}
);

export const lectureController = {
	createIntoDB,
	getAllFromDB,
	getById,

	updateDoc,
	deleteDoc,

	assignedLectureToInstructor,
};
