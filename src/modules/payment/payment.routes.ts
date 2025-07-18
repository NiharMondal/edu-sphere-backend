import { Router } from "express";
import express from "express";
import { paymentController } from "./payment.controller";

const router = Router();

export const stripeWebhooksRoutes = router.post(
	"/",
	express.raw({ type: "application/json" }),
	paymentController.createIntoDB
);

router.get("/", paymentController.getAllFromDB);

export const paymentRoute = router;
