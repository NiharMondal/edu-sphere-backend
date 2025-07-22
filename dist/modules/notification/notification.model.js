"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String, // Optional: e.g., /dashboard/courses/123
    },
    type: {
        type: String, // Optional: "enrollment", "announcement", etc.
    },
}, { timestamps: true });
exports.Notification = (0, mongoose_1.model)("Notification", notificationSchema);
