import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";
import { authGuard } from "../../middleware/authGuard";
import { ROLE } from "../../constant";

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

router.post(
	"/change-password",
	authGuard(ROLE.admin, ROLE.instructor, ROLE.student),
	authController.changePassword
);

router.post("/refresh-token", authController.getRefreshToken);

router.post("/logged-out", authController.loggedOut);
export const authRoute = router;
