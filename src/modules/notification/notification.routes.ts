import { Router } from "express";
import { notificationController } from "./notification.controller";
import { authGuard } from "../../middleware/authGuard";
import { ROLE } from "../../constant";

const router = Router();

router.patch(
	"/mark-all-read",
	authGuard(ROLE.student, ROLE.instructor),
	notificationController.markAllRead
);
router.get(
	"/my-notifications",
	authGuard(ROLE.student, ROLE.instructor),
	notificationController.getByUserId
);

router.patch(
	"/:id/read",
	authGuard(ROLE.student, ROLE.instructor),
	notificationController.markRead
);

// this route is only for admin
router.get(
	"/",
	// authGuard(ROLE.admin),
	notificationController.getAllFromDB
);

export const notificationRoute = router;
