"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: [true, "Category name should be unique"],
    },
    slug: {
        type: String,
        unique: [true, "Slug should be unique"],
    }, // will be auto generated
    icon: String,
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
exports.Category = (0, mongoose_1.model)("Category", categorySchema);
