import Redis from "ioredis";
import logger from "./logger";

export default class RedisClient {
    protected client: Redis | undefined;

    constructor(
        private subChannel: string = "MB_BACKEND_GATEWAY",
        private pubChannel: string = "MB_GATEWAY_BACKEND",
    ) {
        this.client = new Redis();
        this.client.subscribe(this.subChannel);

        this.client?.on("message", (channel, message) => {
            console.log(`Redis Pong; message: ${message}`);
        });
    }

    async disconnect() {
        if (this.client) {
            await this.client.disconnect();
            logger.info("RedisClient disconnected.");
        }
    }

    publishRequest(request: Request) {
        this.client?.publish("request", JSON.stringify(request));
    }
}

//Dev - It wil be moved to package later
type Type = "board" | "account" | "ml";

export interface Request {
    type: Type;
    route: string;
    request: any;
}
