import { Router } from "express";
import { lectureController } from "./lecture.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { lectureValidation } from "./lecture.validation";

const router = Router();

//only admin can create lecture
router.post(
	"/",
	validateRequest(lectureValidation.createLecture),
	lectureController.createIntoDB
);

router
	.route("/admin/:id")
	.patch(lectureController.updateDoc)
	.delete(lectureController.deleteDoc);

router.get("/:id", lectureController.getById);
router.get("/", lectureController.getAllFromDB);

export const lectureRoute = router;
