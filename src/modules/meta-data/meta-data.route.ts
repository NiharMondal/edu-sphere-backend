import { Router } from "express";
import { metaDataController } from "./meta-data.controller";
import { authGuard } from "../../middleware/authGuard";
import { ROLE } from "../../constant";

const router = Router();

router.get("/revenue", authGuard(ROLE.admin), metaDataController.revenue);

router.get(
	"/general-information",
	authGuard(ROLE.admin),
	metaDataController.generalInformation
);

export const metaRoute = router;
