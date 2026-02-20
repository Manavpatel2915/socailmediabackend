import db from "../config/databases/sqldbconnnect";
import { CommentWithUser } from "../types/type"
import { Comment } from '../config/models/sql-models/comment-model';
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
    comment: commentText,
    post_id: postId,
    user_id: userId
  });
  return newComment.toJSON();
}

const updateCommentText = async (
  existingComment: Partial<Comment>,
  commentText: string
) => {
  await existingComment.update({ comment: commentText });
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
      post_id: postId
    },
    offset: offset,
    limit: limit,
    attributes: {
      exclude: ['id', 'post_id', 'user_id']
    },
    include: [
      {
        model: db.User,
        attributes: ['user_name'],
        as: 'user'
      }
    ],
    raw: true,
    nest: true
  });

  return (comments as unknown as CommentWithUser[]).map((comment: CommentWithUser) => ({
    ...comment,
    user_name: comment.user.user_name,
    user: undefined
  }));
}

export {
  findCommentById,
  createNewComment,
  updateCommentText,
  deleteCommentById,
  findCommentByPostId
}