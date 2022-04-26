import { Server } from "socket.io";
import { createServer } from "http";
import type { Express } from "express";
import { seedValue } from "./seedValue";

export const initializeServer = (
  expressServer: Express,
  port: number
): Server => {
  const httpServer = createServer(expressServer);
  const wsServer = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  wsServer.on("connection", (socket) => {
    wsServer.emit("progress", seedValue.count);
    wsServer.emit("messageChanged", seedValue.message);

    console.log(wsServer.sockets.sockets.size);

    socket.on("disconnect", (reason) => {
      console.log(wsServer.sockets.sockets.size);
      console.log(reason);
    });

    socket.on("updateMessage", (message) => {
      seedValue.message = message;

      wsServer.emit("messageChanged", seedValue.message);
    });

    socket.on("updateCanvas", (message) => {
      wsServer.emit("canvasUpdated", message);
    });
  });

  httpServer.listen(port);

  return wsServer;
};
