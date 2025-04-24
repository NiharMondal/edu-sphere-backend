import express, { Application } from "express";
import cors from "cors";

import rootRoutes from "./routes";
import notFoundRoute from "./middleware/notFoundRoute";

import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(express.json());

app.use(
	cors({
		origin: [
			// "https://learn-management-system-mu.vercel.app",
			"http://localhost:3000",
		],
		credentials: true,
	})
);

app.use("/api/v1", rootRoutes);

//not found route handler
app.use(notFoundRoute);

//global error controller/ handler
app.use(globalErrorHandler);

export default app;
