import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

router.get("/by-slug/:slug", categoryController.getBySlug);

router
	.route("/:id")
	.get(categoryController.getById)
	.patch(categoryController.updateDoc)
	.delete(categoryController.deleteDoc);

router
	.route("/")
	.post(categoryController.createIntoDB)
	.get(categoryController.getAllFromDB);

export const categoryRoute = router;
