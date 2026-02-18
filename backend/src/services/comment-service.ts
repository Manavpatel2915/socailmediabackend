import db from "../config/databases/sqldbconnnect";

const findCommentById = async (commentId: number) => {
  const comment = await db.Comment.findByPk(commentId);
  return comment.toJSON();
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
  return newComment.toJSON();
}

const updateCommentText = async (
  existingComment: any,
  commentText: string
) => {
  await existingComment.update({ Comment: commentText });
  return existingComment.toJSON();
}

const deleteCommentById = async (commentId: number) => {
  const deletedCount = await db.Comment.destroy({
    where: {
      id: commentId
    },
  });
  return deletedCount;
}

const findCommentByPostId = async (postId: number, offset: number, limit: number) => {
  const comments = await db.Comment.findAll({
    where: {
      user_id: postId
    },
    offset: offset,
    limit: limit,
    raw: true
  });
  return comments;
}

export {
  findCommentById,
  createNewComment,
  updateCommentText,
  deleteCommentById,
  findCommentByPostId
}