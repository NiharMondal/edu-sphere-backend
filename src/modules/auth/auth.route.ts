import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";

const router = Router();

router.post(
	"/register",
	validateRequest(authValidation.registerUser),
	authController.registerUser
);
router.post(
	"/login",
	validateRequest(authValidation.loginUser),
	authController.loginUser
);

export const authRoute = router;
