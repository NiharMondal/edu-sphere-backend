import { Router } from "express";
import { enrollmentController } from "./enrollment.controller";

const router = Router();

router.get("/my-enrollment/:id", enrollmentController.myEnrollment);

router
	.route("/")
	.post(enrollmentController.createIntoDB)
	.get(enrollmentController.getAllFromDB);

export const enrollmentRoute = router;
