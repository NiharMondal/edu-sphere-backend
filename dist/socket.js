"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSocketMap = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const userSocketMap = new Map(); // userId <-> socketId
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: [
                "https://edu-sphere-five.vercel.app",
                "http://localhost:3000",
            ],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
        }
        socket.on("disconnect", () => {
            if (userId)
                userSocketMap.delete(userId);
        });
    });
    // console.log("🔌 Socket.IO initialized");
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getIO = getIO;
const getUserSocketMap = () => userSocketMap;
exports.getUserSocketMap = getUserSocketMap;
