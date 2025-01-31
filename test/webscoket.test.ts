import logger from "../src/logger";

import WebSocketServer from "../src/websocket";
import { createServer } from "http";
import { io, Socket } from "socket.io-client";

describe("WebSocket Server Communication", () => {
   let webSocketService: WebSocketServer;
   let socketClient: Socket;
   const PORT = process.env.TEST_GATEWAY_PORT || 3000;

   beforeAll(() => {
      const server = createServer();
      //@ts-ignore // Does not use redis in that test
      webSocketService = new WebSocketServer(server);

      server.listen(PORT, () => {
         console.log(`Testing websocket service. PORT[${PORT}]`);
      });
      jest.useRealTimers();
   });

   beforeEach(() => {
      socketClient = io(`http://localhost:${PORT}`, { reconnection: false });
   });
   
   afterEach(() => {
      socketClient.close();
   });

   test("Websocket connection is available to establish", (done) => {
      // Time measurement
      const timeStart = Date.now();

      socketClient.emit("ping");
      console.log("Ping!");

      socketClient.on("pong", (data) => {
         const latency = Date.now() - timeStart;
         console.log(`${data} [Latency: ${latency}ms]`);

         // Warn if latency is over 1 second
         if (latency > 1000) {
            logger.warn(`Latency is greater than ${latency}ms!`);
         }

         done();
      });
   });

});