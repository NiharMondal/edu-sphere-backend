import { Router } from "express";
import { progressController } from "./progress.controller";
import { authGuard } from "../../middleware/authGuard";
import { ROLE } from "../../constant";

const router = Router();

router.get(
	"/course/:courseId",
	authGuard(ROLE.student),
	progressController.getProgressByStudentIdAndCourseId
);
router.get(
	"/my-progress",
	authGuard(ROLE.student),
	progressController.getProgressByStudentId
);

router.post("/lecture/:lectureId", progressController.markLectureComplete);

router.get("/", progressController.getAllFromDB);

export const progressRoute = router;
