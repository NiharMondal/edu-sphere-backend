import { Router } from "express";
import { progressController } from "./progress.controller";

const router = Router();

router.post("/lecture/:lectureId", progressController.markLectureComplete);

export const progressRoute = router;
