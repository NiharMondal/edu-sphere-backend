"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Course title is required"],
        unique: [true, "Course title should be unique"],
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"],
    },
    shortVideo: {
        type: String,
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
        default: "Beginner",
    },
    duration: {
        type: String,
        required: [true, "Duration is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    pricingType: {
        type: String,
        enum: ["free", "paid"],
        default: "paid",
        required: [true, "Pricing type is required"],
    },
    price: {
        type: Number,
        required: function () {
            return this.pricingType === "paid";
        },
    },
    rating: {
        type: Number,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
    },
    instructor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Instructor is required"],
    },
    slug: {
        type: String,
        unique: true,
    },
    modules: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Module",
        },
    ],
}, { timestamps: true });
exports.Course = (0, mongoose_1.model)("Course", courseSchema);
