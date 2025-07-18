"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const slugify_1 = __importDefault(require("slugify"));
const CustomError_1 = __importDefault(require("./CustomError"));
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expiresIn,
    });
    return token;
};
exports.generateToken = generateToken;
const generateSlug = (payload) => {
    if (!payload) {
        throw new CustomError_1.default(400, "Slug payload is not provided!");
    }
    const slug = (0, slugify_1.default)(payload, {
        lower: true,
        trim: true,
    });
    return slug;
};
exports.generateSlug = generateSlug;
