import { Router } from "express";
import { enrollmentController } from "./enrollment.controller";

const router = Router();

router.route("/").post(enrollmentController.createIntoDB);

export const enrollmentRoute = router;
