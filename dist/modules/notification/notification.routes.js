"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoute = void 0;
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const authGuard_1 = require("../../middleware/authGuard");
const constant_1 = require("../../constant");
const router = (0, express_1.Router)();
router.patch("/mark-all-read", (0, authGuard_1.authGuard)(constant_1.ROLE.student, constant_1.ROLE.instructor), notification_controller_1.notificationController.markAllRead);
router.get("/my-notifications", (0, authGuard_1.authGuard)(constant_1.ROLE.student, constant_1.ROLE.instructor), notification_controller_1.notificationController.getByUserId);
router.patch("/:id/read", (0, authGuard_1.authGuard)(constant_1.ROLE.student, constant_1.ROLE.instructor), notification_controller_1.notificationController.markRead);
// this route is only for admin
router.get("/", 
// authGuard(ROLE.admin),
notification_controller_1.notificationController.getAllFromDB);
exports.notificationRoute = router;
