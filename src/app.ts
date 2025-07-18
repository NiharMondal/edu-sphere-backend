import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import rootRoutes from "./routes";

import notFoundRoute from "./middleware/notFoundRoute";

import globalErrorHandler from "./middleware/globalErrorHandler";
import { stripeWebhooksRoutes } from "./modules/payment/payment.routes";

const app: Application = express();
app.use("/webhook", stripeWebhooksRoutes);

app.use(cookieParser());
app.use(express.json());

app.use(
	cors({
		origin: ["https://edu-sphere-five.vercel.app", "http://localhost:3000"],
		credentials: true,
	})
);

app.use("/api/v1", rootRoutes);

//not found route handler
app.use(notFoundRoute);

//global error controller/ handler
app.use(globalErrorHandler);

export default app;
