import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { progressServices } from "./progress.service";

const findAllCoursesProgress = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.user;

		const result = await progressServices.findAllCoursesProgress(id);

		sendResponse(res, {
			statusCode: 201,
			message: "Progress fetched successfully",
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
	findAllCoursesProgress,
	markLectureComplete,
};
