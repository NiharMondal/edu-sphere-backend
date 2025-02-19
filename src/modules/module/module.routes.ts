import { Router } from "express";
import { moduleController } from "./module.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { moduleValidation } from "./module.validation";

const router = Router();

//create module - only admin can create module
router.post(
	"/course/:courseId/create",
	validateRequest(moduleValidation.createModule),
	moduleController.createIntoDB
);

//get all module
router.get("/course/module", moduleController.getAllFromDB);

//only admin can update and delete
router
	.route("/admin/:id")
	.patch(moduleController.updateDoc)
	.delete(moduleController.deleteDoc);

router.get("/:id", moduleController.getById);

export const moduleRoute = router;
