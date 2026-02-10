
import type { Request, Response } from "express";
import { findCommentById, createComment, updateComment, deletedComment } from "../services/comment-service";
import { AppError } from "../utils/AppError";
import { ERRORS, operationFailed, IdNotFound } from '../const/error-message';
import { sendResponse } from '../utils/respones';

const createcomment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user;
    const { Comment } = req.body;

    if (!Comment) {
      const error = ERRORS.ALL_FIELDS_REQUIRED;
      throw new AppError(error.message, error.statusCode);
    }

    const postId = Number(req.params.postId);
    if (!postId || isNaN(postId)) {
      const error = IdNotFound("PostId Not Found!!")
      throw new AppError(error.message, error.statusCode);
    }

    const userId = user ? user.user_id : null;
    const commentData = await createComment(postId, userId, Comment);
  return sendResponse(res, 201, "Comment created", commentData);
  } catch (error){
    operationFailed(error, "Create Comment!");
}
};

const updatecomment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
    }

    const commentId = Number(req.params.commentId);
    if (!commentId || isNaN(commentId)) {
      const error = IdNotFound("Comment Id not Found");
      throw new AppError(error.message, error.statusCode);
    }

    const { Comment } = req.body;
    if (!Comment) {
      const error = ERRORS.ALL_FIELDS_REQUIRED;
      throw new AppError(error.message, error.statusCode);
    }

    const existingComment = await findCommentById(commentId);
    if (!existingComment) {
      throw new AppError(ERRORS.NOT_FOUND("Comment"), 404);
    }

    if (existingComment.user_id !== user.user_id && user.role !== 'Admin') {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    await updateComment(existingComment, Comment);
  return sendResponse(res, 200, "Comment Updated");

  } catch (error){
    operationFailed(error, "Update Comment!");
}
};

const deletecomment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
    }

    const commentId = Number(req.params.id);
    if (!commentId || isNaN(commentId)) {
      const error = IdNotFound("comment Id not Found!!");
      throw new AppError(error.message, error.statusCode);
    }

    const comment = await findCommentById(commentId);
    if (!comment) {
     throw new AppError(ERRORS.NOT_FOUND("Comment"), 404);
    }

    if (comment.user_id !== user.user_id && user.role !== "Admin") {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    await deletedComment(commentId);
    return sendResponse(res, 200, "Comment Deleted");

  } catch (error){
    operationFailed(error, "Delete Comment!");
}
};

export {
  createcomment,
  updatecomment,
  deletecomment
};