import { Router } from "express";
import { notificationController } from "./notification.controller";
import { authGuard } from "../../middleware/authGuard";
import { ROLE } from "../../constant";

const router = Router();

router.patch(
	"/mark-all-read",
	authGuard(ROLE.student),
	notificationController.markAllRead
);
router.get(
	"/student-notification",
	authGuard(ROLE.student),
	notificationController.getByStudentId
);

router.patch(
	"/:id/read",
	authGuard(ROLE.student),
	notificationController.markRead
);

// this route is only for admin
router.get(
	"/",
	// authGuard(ROLE.admin),
	notificationController.getAllFromDB
);

export const notificationRoute = router;
