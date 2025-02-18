import { Request, Response } from "express";

const notFoundRoute = (req: Request, res: Response) => {
	res.status(404).json({
		status: 404,
		message: "Route is not found for " + req.originalUrl,
	});
};

export default notFoundRoute;
