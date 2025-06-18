import { Router } from "express";
import { enrollmentController } from "./enrollment.controller";

const router = Router();

router.get("/my-enrollment/:id", enrollmentController.myEnrollment);
router.post("/create-checkout-session", enrollmentController.createIntoDB);
router.get("/", enrollmentController.getAllFromDB);

export const enrollmentRoute = router;
