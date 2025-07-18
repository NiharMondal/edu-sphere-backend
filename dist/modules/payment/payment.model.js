"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentHistory = void 0;
const mongoose_1 = require("mongoose");
const paymentHistorySchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Student ID is required"],
        ref: "User",
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Course ID is required"],
        ref: "Course",
    },
    checkoutSessionId: {
        type: String,
        required: [true, "Checkout session ID is required"],
    },
    amount: {
        type: Number,
        required: [true, "Course Amount is required"],
    },
    currency: String,
    paymentStatus: String,
    paymentIntentId: String,
    customerDetails: {
        email: String,
        name: String,
        address: mongoose_1.Schema.Types.Mixed,
    },
}, { timestamps: true });
exports.PaymentHistory = (0, mongoose_1.model)("PaymentHistory", paymentHistorySchema);
