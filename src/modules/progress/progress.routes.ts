import { Router } from "express";
import { progressController } from "./progress.controller";

const router = Router();

router.patch("/:lectureId", progressController.markLectureComplete);

export const progressRoute = router;
