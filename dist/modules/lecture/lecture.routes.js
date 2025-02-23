"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lectureRoute = void 0;
const express_1 = require("express");
const lecture_controller_1 = require("./lecture.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const lecture_validation_1 = require("./lecture.validation");
const router = (0, express_1.Router)();
//only admin can create lecture
router.post("/module/:moduleId/create", (0, validateRequest_1.validateRequest)(lecture_validation_1.lectureValidation.createLecture), lecture_controller_1.lectureController.createIntoDB);
router
    .route("/admin/:id")
    .patch(lecture_controller_1.lectureController.updateDoc)
    .delete(lecture_controller_1.lectureController.deleteDoc);
router.get("/:id", lecture_controller_1.lectureController.getById);
router.get("/", lecture_controller_1.lectureController.getAllFromDB);
exports.lectureRoute = router;
