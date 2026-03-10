import { Server } from "socket.io";

const ROOM = "room";

const emitChatMessage = (io: Server, data: unknown): void => {
  io.to(ROOM).emit("chatMessage", data);
};

const emitRoomNotice = (io: Server, socketId: string, userName: string): void => {
  io.to(ROOM).except(socketId).emit("roomNotice", userName);
};

const emitChatError = (io: Server, socketId: string, error: string): void => {
  io.to(socketId).emit("chatError", { error });
};

export { emitChatMessage, emitRoomNotice, emitChatError, ROOM };