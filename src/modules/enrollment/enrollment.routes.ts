import { Router } from "express";
import { enrollmentController } from "./enrollment.controller";
import { authGuard } from "../../middleware/authGuard";
import { ROLE } from "../../constant";

const router = Router();

router.get(
	"/my-enrollment",
	authGuard(ROLE.student),
	enrollmentController.myEnrollment
);
router.post("/create-checkout-session", enrollmentController.createIntoDB);
router.get("/", enrollmentController.getAllFromDB);

export const enrollmentRoute = router;
