import app from "./app";
import mongoose from "mongoose";
import { envConfig } from "./config";
import { Server } from "http";

let server: Server;

async function main() {
	try {
		await mongoose.connect(envConfig.mongo_uri as string);

		server = app.listen(envConfig.port, () => {
			console.log(
				`\nApp is listening on port ${envConfig.port} \nMongoDB connected successfully`
			);
		});
	} catch (err) {
		console.log(err);
	}
}

main();
