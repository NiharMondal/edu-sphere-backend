import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { courseServices } from "./course.service";
import { TQuery } from "../../type";

const createIntoDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.createIntoDB(req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "Course created successfully",
		result: result,
	});
});

const getAllFromDB = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.getAllFromDB(req.query as TQuery);

	sendResponse(res, {
		statusCode: 200,
		message: "Course fetched successfully",
		result: result.courses,
		meta: result.meta,
	});
});

const getById = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Course fetched successfully",
		result: result,
	});
});

const getBySlug = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.getBySlug(req.params.slug);

	sendResponse(res, {
		statusCode: 200,
		message: "Course fetched successfully",
		result: result,
	});
});

const updateDoc = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await courseServices.updateDoc(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Course updated successfully",
		result: result,
	});
});

const deleteDoc = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.deleteDoc(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Course deleted successfully",
		result: result,
	});
});

const popularCourses = asyncHandler(async (req: Request, res: Response) => {
	const result = await courseServices.popularCourses();

	sendResponse(res, {
		statusCode: 200,
		message: "Popular courses fetched successfully",
		result: result,
	});
});
const getCoursesByInstructorId = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.user;
		const result = await courseServices.getCoursesByInstructorId(id);

		sendResponse(res, {
			statusCode: 200,
			message: "My courses fetched successfully",
			result: result,
		});
	}
);

export const courseController = {
	createIntoDB,
	getAllFromDB,
	getById,
	getBySlug,
	updateDoc,
	deleteDoc,

	popularCourses,
	getCoursesByInstructorId,
};
