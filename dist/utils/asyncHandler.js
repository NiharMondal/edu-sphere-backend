"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch((err) => next(err));
    };
};
exports.default = asyncHandler;
