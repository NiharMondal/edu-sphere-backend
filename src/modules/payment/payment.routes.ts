import { Router } from "express";
import express from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	paymentController.createIntoDB
);

export const paymentRoute = router;
