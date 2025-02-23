"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routesArr_1 = require("./routesArr");
const rootRoutes = (0, express_1.Router)();
routesArr_1.routesArray.forEach((el) => rootRoutes.use(el.path, el.route));
exports.default = rootRoutes;
