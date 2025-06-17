import { Router } from "express";
import { courseController } from "./course.controller";
import { courseValidation } from "./course.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

// popular courses
router.get("/popular-courses", courseController.popularCourses);

// update and delete
router
	.route("/:id")
	.patch(courseController.updateDoc)
	.delete(courseController.deleteDoc);

//find by slug
router.get("/by-slug/:slug", courseController.getBySlug);

//find by ID
router.get("/:id", courseController.getById);

// create and get-all-doc
router
	.route("/")
	.post(
		validateRequest(courseValidation.createCourse), // only admin and instructors can create course
		courseController.createIntoDB
	)
	.get(courseController.getAllFromDB);

export const courseRoute = router;
