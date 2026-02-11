
import db from "../config/databases/sqldbconnnect";

const findCommentById = async (commentId: number) => {
  const comment = await db.Comment.findByPk(commentId);
  return comment;
}

const createNewComment = async (
  postId: number,
  userId: number | null,
  commentText: string
) => {
  const newComment = await db.Comment.create({
    Comment: commentText,
    post_id: postId,
    user_id: userId
  });
  return newComment;
}

const updateCommentText = async (
  existingComment: any,
  commentText: string
) => {
  return await existingComment.update({ Comment: commentText });
}

const deleteCommentById = async (commentId: number) => {
  const deletedCount = await db.Comment.destroy({
    where: {
      id: commentId
    }
  });
  return deletedCount;
}

export {
  findCommentById,
  createNewComment,
  updateCommentText,
  deleteCommentById,
}