import { Server, Socket } from "socket.io";
import { createMessage } from "../services/messages-service";
import { emitChatMessage, emitRoomNotice, emitChatError, ROOM } from "./socket-emitters";

interface ChatMessagePayload {
  conversation_id: number;
  sender_id: number;
  message: string;
}

const registerSocketHandlers = (io: Server, socket: Socket): void => {

  socket.on("joinRoom", async (userName: string) => {
    try {
      console.log(`${userName} is joining the room`);
      await socket.join(ROOM);
      emitRoomNotice(io, socket.id, userName);
      // io.emit("roomNotice", userName)
    } catch (error) {
      console.error("joinRoom error:", error);
    }
  });

  socket.on("chatMessage", async (data: ChatMessagePayload) => {
    try {
      const saved = await createMessage(
        data.conversation_id,
        data.sender_id,
        data.message,
      );
      emitChatMessage(io, saved);
    } catch (error) {
      console.error("chatMessage error:", error);
      emitChatError(io, socket.id, "Failed to send message");
    }
  });

};

export { registerSocketHandlers };