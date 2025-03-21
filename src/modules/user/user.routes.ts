import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/instructors", userController.getInstructors);
router.get("/", userController.getAllFromDB);

export const userRoutes = router;
