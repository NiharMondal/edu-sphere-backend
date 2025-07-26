"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const authGuard_1 = require("../../middleware/authGuard");
const constant_1 = require("../../constant");
const router = (0, express_1.Router)();
router.patch("/:id", user_controller_1.userController.updateDoc);
router.get("/my-profile", (0, authGuard_1.authGuard)(constant_1.ROLE.admin, constant_1.ROLE.student, constant_1.ROLE.instructor), user_controller_1.userController.getMyProfile);
router.patch("/update-role/:id", (0, authGuard_1.authGuard)(constant_1.ROLE.admin), // only admin can update user's role
user_controller_1.userController.updateRole);
//get user
router.get("/:id", user_controller_1.userController.getUserById);
router.get("/", user_controller_1.userController.getAllFromDB);
exports.userRoute = router;
