"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const http_1 = require("http");
const socket_1 = require("./socket");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.envConfig.mongo_uri);
            const server = (0, http_1.createServer)(app_1.default);
            // Init Socket.IO
            (0, socket_1.initSocket)(server);
            server.listen(config_1.envConfig.port, () => {
                console.log(`✅ App is listening on port ${config_1.envConfig.port}\n✅ MongoDB connected successfully\n`);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
main();
