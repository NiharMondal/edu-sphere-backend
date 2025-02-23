"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRoute = void 0;
const express_1 = require("express");
const module_controller_1 = require("./module.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const module_validation_1 = require("./module.validation");
const router = (0, express_1.Router)();
//create module - only admin can create module
router.post("/course/:courseId/create", (0, validateRequest_1.validateRequest)(module_validation_1.moduleValidation.createModule), module_controller_1.moduleController.createIntoDB);
//get all module
router.get("/course/module", module_controller_1.moduleController.getAllFromDB);
//only admin can update and delete
router
    .route("/admin/:id")
    .patch(module_controller_1.moduleController.updateDoc)
    .delete(module_controller_1.moduleController.deleteDoc);
router.get("/:id", module_controller_1.moduleController.getById);
exports.moduleRoute = router;
