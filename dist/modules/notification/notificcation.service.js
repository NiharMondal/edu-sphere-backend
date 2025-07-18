"use strict";
// notification has been created when user enroll the course
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationServices = void 0;
const notification_model_1 = require("./notification.model");
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield notification_model_1.Notification.find();
    return notifications;
});
const getByStudentId = (sId) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield notification_model_1.Notification.find({ student: sId }).sort({
        createdAt: -1,
    });
    return notifications;
});
const markRead = (nId, sId) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.Notification.findOneAndUpdate({ _id: nId, student: sId }, { isRead: true }, { new: true });
    return notification;
});
const markAllRead = (sId) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield notification_model_1.Notification.updateMany({ student: sId, isRead: false }, { isRead: true });
    return notifications;
});
exports.notificationServices = {
    getAllFromDB,
    getByStudentId,
    markRead,
    markAllRead,
};
