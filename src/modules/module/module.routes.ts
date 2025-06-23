import { Router } from "express";
import { moduleController } from "./module.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { moduleValidation } from "./module.validation";

const router = Router();

//create module - only admin can create module
router.post(
	"/:courseId/create",
	validateRequest(moduleValidation.createModule),
	moduleController.createIntoDB
);

//only admin can update and delete
router
	.route("/:id")
	.patch(moduleController.updateDoc)
	.delete(moduleController.deleteDoc);

router.get("/courseId/:courseId", moduleController.getByCourseId);
router.get("/:id", moduleController.getById);

//get all module
router.get("/", moduleController.getAllFromDB);

export const moduleRoute = router;
