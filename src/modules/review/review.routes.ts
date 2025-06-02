import { Router } from "express";
import { reviewController } from "./review.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { reviewValidation } from "./review.validation";

const router = Router();

router
	.route("/")
	.post(
		validateRequest(reviewValidation.createReview),
		reviewController.createIntoDB
	);

export const reviewRoute = router;
