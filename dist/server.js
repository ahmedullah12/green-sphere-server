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
exports.io = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const socket_io_1 = require("socket.io");
let server;
let io;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.db_url);
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`Server running on  ${config_1.default.port}`);
            });
            exports.io = io = new socket_io_1.Server(server, {
                cors: {
                    origin: ['http://localhost:3000', 'https://greensphere.netlify.app'],
                    credentials: true,
                },
            });
            io.on('connection', (socket) => {
                console.log(`User connected ${socket.id}`);
                // Join a room with the user's ID for private notifications
                socket.on('join', (userId) => {
                    socket.join(userId);
                });
                socket.on('disconnect', () => {
                    console.log(`User disconnected ${socket.id}`);
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
main();
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    console.log(`unhandledRejection is detected, shutting down ...`);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on('uncaughtException', () => {
    console.log(`uncaughtException is detected, shutting down ...`);
    process.exit(1);
});
