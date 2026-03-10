import db from "../config/databases/sql-connect";

const createConversation = async (
  user_one_id: number,
  user_two_id: number,
) => {
  return await db.conversations.create({
    user_one_id,
    user_two_id
  })
}

export {
  createConversation,
}
