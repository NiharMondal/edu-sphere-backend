import { Router } from "express";
import { courseController } from "./course.controller";
import { courseValidation } from "./course.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { authGuard } from "../../middleware/authGuard";
import { ROLE } from "../../constant";

const router = Router();

//get-courses by instructor id
router.get(
	"/instructor/assigned-course",
	authGuard(ROLE.instructor),
	courseController.getCoursesByInstructorId
);
// popular courses
router.get("/popular-courses", courseController.popularCourses);

//find by slug
router.get("/by-slug/:slug", courseController.getBySlug);

// update and delete
router
	.route("/:id")
	.patch(authGuard(ROLE.admin, ROLE.instructor), courseController.updateDoc)
	.delete(authGuard(ROLE.admin), courseController.deleteDoc);

//find by ID
router.get("/:id", courseController.getById);

// create and get-all-doc
router
	.route("/")
	.post(
		validateRequest(courseValidation.createCourse),
		authGuard(ROLE.admin),
		courseController.createIntoDB
	)
	.get(courseController.getAllFromDB);

export const courseRoute = router;
