import { Router } from "express";
import { moduleController } from "./module.controller";

const router = Router();
router.post("/course/:courseId/module", moduleController.createIntoDB);
export const moduleRoute = router;
