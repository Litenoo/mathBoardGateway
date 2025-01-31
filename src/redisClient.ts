//Read more about socket.io-redis package, but it is probably useless in that case
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
}