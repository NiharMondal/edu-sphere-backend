import { Router } from "express";
import { progressController } from "./progress.controller";
import { authGuard } from "../../middleware/authGuard";
import { ROLE } from "../../constant";

const router = Router();

router.get(
	"/my-progress",
	authGuard(ROLE.student),
	progressController.findAllCoursesProgress
);

router.post("/lecture/:lectureId", progressController.markLectureComplete);

export const progressRoute = router;
