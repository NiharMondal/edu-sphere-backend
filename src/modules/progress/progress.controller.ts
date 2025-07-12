import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { progressServices } from "./progress.service";

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await progressServices.getAllFromDB(req.query as {});

	sendResponse(res, {
		statusCode: 200,
		message: "Progress fetched successfully",
		result: result,
	});
});
const getProgressByStudentId = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.user;

		const result = await progressServices.getProgressByStudentId(id);

		sendResponse(res, {
			statusCode: 200,
			message: "Progress fetched successfully",
			result: result,
		});
	}
);
const getProgressByStudentIdAndCourseId = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.user;
		const { courseId } = req.params;
		const result = await progressServices.getProgressByStudentIdAndCourseId(
			id,
			courseId
		);

		sendResponse(res, {
			statusCode: 200,
			message: "Course progress fetched successfully",
			result: result,
		});
	}
);

const markLectureComplete = asyncHandler(
	async (req: Request, res: Response) => {
		const lectureId = req.params.lectureId;

		const { student, course } = req.body;

		const result = await progressServices.markLectureComplete(
			course,
			student,
			lectureId
		);

		sendResponse(res, {
			statusCode: 201,
			message: "Lecture updated successfully",
			result: result,
		});
	}
);

export const progressController = {
	getAllFromDB,
	getProgressByStudentId,
	getProgressByStudentIdAndCourseId,
	markLectureComplete,
};
