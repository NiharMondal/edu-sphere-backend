// server.ts
import app from "./app";
import mongoose from "mongoose";
import { envConfig } from "./config";
import { createServer } from "http";
import { initSocket } from "./socket";

async function main() {
	try {
		await mongoose.connect(envConfig.mongo_uri as string);

		const server = createServer(app);

		// Init Socket.IO
		initSocket(server);

		server.listen(envConfig.port, () => {
			console.log(
				`✅ App is listening on port ${envConfig.port}\n✅ MongoDB connected successfully\n`
			);
		});
	} catch (err) {
		console.log(err);
	}
}

main();
