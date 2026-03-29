import { Server } from "socket.io";
import { SOCKET_EVENTS } from "../constants/index.js";
import logger from "../utils/logger.js";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    logger.socket(`Client connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      logger.socket(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
