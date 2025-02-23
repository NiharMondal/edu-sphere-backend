"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundRoute = (req, res) => {
    res.status(404).json({
        status: 404,
        message: "Route is not found for " + req.originalUrl,
    });
};
exports.default = notFoundRoute;
