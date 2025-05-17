import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { progressServices } from "./progress.service";

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
			message: "Course enrolled successfully",
			result: result,
		});
	}
);

export const progressController = { markLectureComplete };
