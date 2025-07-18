import { NextFunction, Request, Response } from "express";
import { Mongoose, MongooseError } from "mongoose";
import { ZodError, ZodIssue } from "zod";

const globalErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errorResponse = {
		statusCode: err?.statusCode || 500,
		message: err?.message || "Something went wrong!",
		errorDetails: err,
	};

	//zod error
	if (err instanceof ZodError) {
		errorResponse.statusCode = 400;
		errorResponse.message = err.issues
			.map((errObj) => errObj.message)
			.toString();
		errorResponse.errorDetails = err.issues.map((error: ZodIssue) => {
			return {
				field: error.path[0],
				message: error.message,
			};
		});
	}

	//mongoose duplicate key error
	if (err?.code === 11000) {
		errorResponse.statusCode = 302;
		errorResponse.message = "Duplicate key error";
		errorResponse.errorDetails = err?.keyValue;
	}
	//final response
	res.status(errorResponse.statusCode).json({
		success: false,
		message: errorResponse.message,
		errorDetails: errorResponse.errorDetails,
	});
};

export default globalErrorHandler;
