import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import RedisClient from "./redisClient";
import logger from "./logger";

export default class WebSocketServer {
    private io: SocketIOServer;
    protected redisClient: RedisClient;

    constructor(httpServer: HTTPServer, redisClient: RedisClient, SocketIO_Options: Partial<SocketIOServer["opts"]> = {}) {
        //SocketIO definition
        this.io = new SocketIOServer(httpServer, SocketIO_Options);
        this.redisClient = redisClient;

        //Routing
        this.io.on("connection", (socket: Socket) => {
            socket.on("ping", () => {
                socket.emit("pong", `Pong!`);
            });

            socket.on("disconnect", () => {
                console.log(`Client SOCKET[${socket.id}] disconnected.`);
            });

            socket.onAny((event, request: Request) => {
                switch (request.type) {
                    case "board":
                        this.passRequestViaRedis(request);
                        //board mechanics
                        break;
                    case "ml":
                        //ml request to backend
                        break;
                    case "account":
                        //account logic
                        break;
                }
            });
        });
    }

    close() {
        this.io.close();
    }

    passRequestViaRedis(request: Request) {
        // if (!this.validateRequest(request)) {
        //     logger.error(new Error(`Request is not valid, REQ: ${request}`));
        // }
        this.redisClient.publishRequest(request);
    }

    // validateRequest(data: any): data is Request {
    //     return (
    //         typeof data.type === "string" &&
    //         typeof data.route === "string"
    //     )
    // }
}

//DEV - It will be moved to package later

type Type = "board" | "account" | "ml";

export interface Request { //dev
    type: Type;
    route: string;
    request: any;
}

export interface registerRequest {
    username: string;
    email: string;
    password: string;
}

export interface loginRequest {
    email: string;
    password: string;
}