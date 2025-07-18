import { authGuard } from "./../../middleware/authGuard";
import { Router } from "express";
import { categoryController } from "./category.controller";
import { ROLE } from "../../constant";

const router = Router();

router.get("/by-slug/:slug", categoryController.getBySlug);

router
	.route("/:id")
	.get(categoryController.getById)
	.patch(authGuard(ROLE.admin), categoryController.updateDoc)
	.delete(authGuard(ROLE.admin), categoryController.deleteDoc);

router
	.route("/")
	.post(categoryController.createIntoDB)
	.get(categoryController.getAllFromDB);

export const categoryRoute = router;
