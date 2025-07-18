"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lectureRoute = void 0;
const express_1 = require("express");
const lecture_controller_1 = require("./lecture.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const lecture_validation_1 = require("./lecture.validation");
const authGuard_1 = require("../../middleware/authGuard");
const constant_1 = require("../../constant");
const router = (0, express_1.Router)();
router.get("/assigned-lectures", (0, authGuard_1.authGuard)(constant_1.ROLE.instructor), lecture_controller_1.lectureController.assignedLectureToInstructor);
// admin and instructor can create lecture
router.post("/:moduleId/create", (0, validateRequest_1.validateRequest)(lecture_validation_1.lectureValidation.createLecture), (0, authGuard_1.authGuard)(constant_1.ROLE.admin, constant_1.ROLE.instructor), lecture_controller_1.lectureController.createIntoDB);
//only admin can delete and update lecture
router
    .route("/:id")
    .patch(lecture_controller_1.lectureController.updateDoc)
    .delete(lecture_controller_1.lectureController.deleteDoc);
router.get("/:id", lecture_controller_1.lectureController.getById);
router.get("/", lecture_controller_1.lectureController.getAllFromDB);
exports.lectureRoute = router;
