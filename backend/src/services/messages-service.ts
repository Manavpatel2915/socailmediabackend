import db from "../config/databases/sql-connect";

const createMessage = async (
  conversation_id: number,
  sender_id: number,
  message: string,
  is_read?: boolean,
) => {
  const data = await db.Message.create({
    conversation_id,
    sender_id,
    message,
    is_read,
  });
  return data;
}

export {
  createMessage
}