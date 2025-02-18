import { Request, Response, RequestHandler, NextFunction } from "express";

const asyncHandler = (func: RequestHandler) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(func(req, res, next)).catch((err) => next(err));
	};
};

export default asyncHandler;
