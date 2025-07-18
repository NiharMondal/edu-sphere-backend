import { Router } from "express";
import { lectureController } from "./lecture.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { lectureValidation } from "./lecture.validation";
import { authGuard } from "../../middleware/authGuard";
import { ROLE } from "../../constant";

const router = Router();

router.get(
	"/assigned-lectures",
	authGuard(ROLE.instructor),
	lectureController.assignedLectureToInstructor
);

// admin and instructor can create lecture
router.post(
	"/:moduleId/create",
	validateRequest(lectureValidation.createLecture),
	authGuard(ROLE.admin, ROLE.instructor),
	lectureController.createIntoDB
);

//only admin can delete and update lecture
router
	.route("/:id")
	.patch(lectureController.updateDoc)
	.delete(lectureController.deleteDoc);

router.get("/:id", lectureController.getById);
router.get("/", lectureController.getAllFromDB);

export const lectureRoute = router;
