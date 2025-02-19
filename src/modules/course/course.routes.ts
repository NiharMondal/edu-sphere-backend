import { Router } from "express";
import { courseController } from "./course.controller";
import { courseValidation } from "./course.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

// update and delete
router
	.route("/:id")
	.patch(courseController.updateDoc)
	.delete(courseController.deleteDoc);

//find by slug
router.get("/slug/:slug", courseController.getBySlug);

//find by ID
router.get("/:id", courseController.getById);

// create and get-all-doc
// only admin can create course
router
	.route("/")
	.post(
		validateRequest(courseValidation.createCourse),
		courseController.createIntoDB
	)
	.get(courseController.getAllFromDB);

export const courseRoute = router;
