// socket/socket.ts
import { Server as HTTPServer } from "http";
import { Server as IOServer } from "socket.io";

let io: IOServer;
const userSocketMap = new Map<string, string>(); // userId <-> socketId

export const initSocket = (server: HTTPServer) => {
	io = new IOServer(server, {
		cors: {
			origin: [
				"https://edu-sphere-five.vercel.app",
				"http://localhost:3000",
			],
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId as string;
		if (userId) {
			userSocketMap.set(userId, socket.id);
		}

		socket.on("disconnect", () => {
			if (userId) userSocketMap.delete(userId);
		});
	});

	// console.log("🔌 Socket.IO initialized");
};

export const getIO = () => {
	if (!io) {
		throw new Error("Socket.io not initialized!");
	}
	return io;
};

export const getUserSocketMap = () => userSocketMap;
