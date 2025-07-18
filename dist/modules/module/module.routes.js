"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRoute = void 0;
const express_1 = require("express");
const module_controller_1 = require("./module.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const module_validation_1 = require("./module.validation");
const authGuard_1 = require("../../middleware/authGuard");
const constant_1 = require("../../constant");
const router = (0, express_1.Router)();
router.get("/assigned-modules", (0, authGuard_1.authGuard)(constant_1.ROLE.instructor), module_controller_1.moduleController.assignedModuleToInstructor);
//create module - only admin can create module
router.post("/:courseId/create", (0, validateRequest_1.validateRequest)(module_validation_1.moduleValidation.createModule), module_controller_1.moduleController.createIntoDB);
//only admin can update and delete
router
    .route("/:id")
    .patch(module_controller_1.moduleController.updateDoc)
    .delete(module_controller_1.moduleController.deleteDoc);
router.get("/courseId/:courseId", module_controller_1.moduleController.getByCourseId);
router.get("/:id", module_controller_1.moduleController.getById);
//get all module
router.get("/", module_controller_1.moduleController.getAllFromDB);
exports.moduleRoute = router;
