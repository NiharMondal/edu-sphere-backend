import { Router } from "express";
import { courseController } from "./course.controller";

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
router
	.route("/")
	.post(courseController.createIntoDB)
	.get(courseController.getAllFromDB);

export const courseRoute = router;
