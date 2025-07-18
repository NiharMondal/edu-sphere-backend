"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoute = void 0;
const authGuard_1 = require("./../../middleware/authGuard");
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const constant_1 = require("../../constant");
const router = (0, express_1.Router)();
router.get("/by-slug/:slug", category_controller_1.categoryController.getBySlug);
router
    .route("/:id")
    .get(category_controller_1.categoryController.getById)
    .patch((0, authGuard_1.authGuard)(constant_1.ROLE.admin), category_controller_1.categoryController.updateDoc)
    .delete((0, authGuard_1.authGuard)(constant_1.ROLE.admin), category_controller_1.categoryController.deleteDoc);
router
    .route("/")
    .post(category_controller_1.categoryController.createIntoDB)
    .get(category_controller_1.categoryController.getAllFromDB);
exports.categoryRoute = router;
