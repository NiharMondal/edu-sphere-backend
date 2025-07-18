"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    const errorResponse = {
        statusCode: (err === null || err === void 0 ? void 0 : err.statusCode) || 500,
        message: (err === null || err === void 0 ? void 0 : err.message) || "Something went wrong!",
        errorDetails: err,
    };
    //zod error
    if (err instanceof zod_1.ZodError) {
        errorResponse.statusCode = 400;
        errorResponse.message = err.issues
            .map((errObj) => errObj.message)
            .toString();
        errorResponse.errorDetails = err.issues.map((error) => {
            return {
                field: error.path[0],
                message: error.message,
            };
        });
    }
    //mongoose duplicate key error
    if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        errorResponse.statusCode = 302;
        errorResponse.message = "Duplicate key error";
        errorResponse.errorDetails = err === null || err === void 0 ? void 0 : err.keyValue;
    }
    //final response
    res.status(errorResponse.statusCode).json({
        success: false,
        message: errorResponse.message,
        errorDetails: errorResponse.errorDetails,
    });
};
exports.default = globalErrorHandler;
