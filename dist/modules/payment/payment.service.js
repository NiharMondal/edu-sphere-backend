"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentServices = void 0;
const stripe_1 = __importDefault(require("stripe"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const enrollment_model_1 = require("../enrollment/enrollment.model");
const payment_model_1 = require("./payment.model");
const config_1 = require("../../config");
const QueryBuilder_1 = __importDefault(require("../../lib/QueryBuilder"));
const stripe = new stripe_1.default(config_1.envConfig.stripe_secret_key);
const webhookSecret = config_1.envConfig.stripe_web_secret;
const createIntoDB = (body, sig) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    }
    catch (err) {
        throw new CustomError_1.default(400, `Webhook Error: ${err}.message`);
    }
    // Handle successful payment
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        // 1. Update Enrollment
        yield enrollment_model_1.Enrollment.findByIdAndUpdate((_a = session === null || session === void 0 ? void 0 : session.metadata) === null || _a === void 0 ? void 0 : _a.enrollmentId, {
            $set: {
                status: "paid",
            },
        });
        // 2. Save Payment History
        yield payment_model_1.PaymentHistory.create({
            student: (_b = session === null || session === void 0 ? void 0 : session.metadata) === null || _b === void 0 ? void 0 : _b.student,
            course: (_c = session === null || session === void 0 ? void 0 : session.metadata) === null || _c === void 0 ? void 0 : _c.course,
            checkoutSessionId: session === null || session === void 0 ? void 0 : session.id,
            amount: (session === null || session === void 0 ? void 0 : session.amount_total) / 100,
            currency: session.currency,
            paymentStatus: session === null || session === void 0 ? void 0 : session.payment_status,
            paymentIntentId: session === null || session === void 0 ? void 0 : session.payment_intent,
            customerDetails: {
                email: (_d = session === null || session === void 0 ? void 0 : session.customer_details) === null || _d === void 0 ? void 0 : _d.email,
                name: (_e = session === null || session === void 0 ? void 0 : session.customer_details) === null || _e === void 0 ? void 0 : _e.name,
                address: (_f = session === null || session === void 0 ? void 0 : session.customer_details) === null || _f === void 0 ? void 0 : _f.address,
            },
        });
    }
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const data = new QueryBuilder_1.default(payment_model_1.PaymentHistory.find(), query).sort();
    const paymentHistory = yield data.queryModel
        .populate({ path: "student", select: "name" })
        .populate({ path: "course", select: "title" })
        .select("paymentIntentId student course amount");
    return paymentHistory;
});
exports.paymentServices = { createIntoDB, getAllFromDB };
