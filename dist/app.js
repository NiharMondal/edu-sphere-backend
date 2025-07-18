"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const notFoundRoute_1 = __importDefault(require("./middleware/notFoundRoute"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const payment_routes_1 = require("./modules/payment/payment.routes");
const app = (0, express_1.default)();
app.use("/webhook", payment_routes_1.stripeWebhooksRoutes);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["https://edu-sphere-five.vercel.app", "http://localhost:3000"],
    credentials: true,
}));
app.use("/api/v1", routes_1.default);
//not found route handler
app.use(notFoundRoute_1.default);
//global error controller/ handler
app.use(globalErrorHandler_1.default);
exports.default = app;
