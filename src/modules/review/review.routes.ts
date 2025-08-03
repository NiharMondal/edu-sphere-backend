import { Router } from "express";
import { reviewController } from "./review.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { reviewValidation } from "./review.validation";
import { authGuard } from "../../middleware/authGuard";
import { ROLE } from "../../constant";

const router = Router();

router.get("/:courseId/course-review", reviewController.getByCourseId);

router.patch(
	"/:id/undo-accept",
	authGuard(ROLE.admin),
	reviewController.undoAccept
);
router.patch(
	"/:id/accept",
	authGuard(ROLE.admin),
	reviewController.acceptReview
);

router
	.route("/:id")
	.get(reviewController.getById)
	.patch(
		authGuard(ROLE.admin, ROLE.student),
		validateRequest(reviewValidation.updateReview),
		reviewController.updateDoc
	)
	.delete(authGuard(ROLE.student, ROLE.admin), reviewController.deleteDoc);
router
	.route("/")
	.post(
		validateRequest(reviewValidation.createReview),
		reviewController.createIntoDB
	)
	.get(
		// authGuard(ROLE.admin),
		reviewController.getAllFromDB
	);

export const reviewRoute = router;
