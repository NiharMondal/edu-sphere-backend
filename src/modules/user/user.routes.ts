import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.patch("/update-role/:id", userController.updateRole); // only admin can update user's role
router.get("/instructors", userController.getInstructors);
router.get("/:id", userController.getUserById);
router.get("/", userController.getAllFromDB);

export const userRoutes = router;
