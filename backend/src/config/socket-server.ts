import { Server } from "socket.io";
import { createServer, Server as HttpServer } from "node:http";
import { Application } from "express";
import { registerSocketHandlers } from "../controller/socket-handlers";

let io: Server;

const initSocketServer = (app: Application): HttpServer => {
  const server = createServer(app);
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    registerSocketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });

  return server;
};

const getIo = (): Server => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export { initSocketServer, getIo };