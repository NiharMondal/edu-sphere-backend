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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const mongoose_1 = require("mongoose");
const moduleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Module name is required"],
        unique: [true, "Module title should be unique"],
    },
    index: {
        type: Number,
        default: 1, // auto-incremented
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Course ID is required"],
        ref: "Course",
    },
    lectures: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Lecture",
        },
    ],
}, { timestamps: true });
moduleSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isNew)
            return next(); // Only run on new documents
        const Module = (0, mongoose_1.model)("Module"); // Get the Module model
        const lastModule = yield Module.findOne({ course: this.course }) // Find the last module in the course
            .sort("-index")
            .select("index");
        this.index = lastModule ? lastModule.index + 1 : 1; // Increment index
        next();
    });
});
exports.Module = (0, mongoose_1.model)("Module", moduleSchema);
