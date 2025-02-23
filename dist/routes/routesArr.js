"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesArray = void 0;
const auth_route_1 = require("../modules/auth/auth.route");
const course_routes_1 = require("../modules/course/course.routes");
const lecture_routes_1 = require("../modules/lecture/lecture.routes");
const module_routes_1 = require("../modules/module/module.routes");
exports.routesArray = [
    { path: "/auth", route: auth_route_1.authRoute },
    { path: "/course", route: course_routes_1.courseRoute },
    { path: "/module", route: module_routes_1.moduleRoute },
    { path: "/lecture", route: lecture_routes_1.lectureRoute },
];
