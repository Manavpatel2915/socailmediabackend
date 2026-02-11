
import type { Request, Response } from "express";
import {
  findCommentById,
  createNewComment,
  updateCommentText,
  deleteCommentById
} from "../services/comment-service";
import { AppError } from "../utils/AppError";
import { ERRORS, operationFailed, IdNotFound } from '../const/error-message';
import { sendResponse } from '../utils/respones';

const createComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;
    const { Comment } = req.body;

    if (!Comment) {
      const error = ERRORS.ALL_FIELDS_REQUIRED;
      throw new AppError(error.message, error.statusCode);
    }

    const postId = Number(req.params.postId);
    if (!postId || isNaN(postId)) {
      const error = IdNotFound("PostId");
      throw new AppError(error.message, error.statusCode);
    }

    const userId = authenticatedUser ? authenticatedUser.user_id : null;
    const newComment = await createNewComment(postId, userId, Comment);

    return sendResponse(res, 201, "Comment created successfully!", newComment);
  } catch (error) {
    operationFailed(error, "Create Comment!");
  }
};

const updateComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
    }

    const commentId = Number(req.params.commentId);
    if (!commentId || isNaN(commentId)) {
      const error = IdNotFound("CommentId");
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

    if (existingComment.user_id !== authenticatedUser.user_id && authenticatedUser.role !== 'Admin') {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    const updatedComment = await updateCommentText(existingComment, Comment);
    return sendResponse(res, 200, "Comment updated successfully!", updatedComment);

  } catch (error) {
    operationFailed(error, "Update Comment!");
  }
};

const deleteComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
    }

    const commentId = Number(req.params.id);
    if (!commentId || isNaN(commentId)) {
      const error = IdNotFound("CommentId");
      throw new AppError(error.message, error.statusCode);
    }

    const commentToDelete = await findCommentById(commentId);
    if (!commentToDelete) {
      throw new AppError(ERRORS.NOT_FOUND("Comment"), 404);
    }

    if (commentToDelete.user_id !== authenticatedUser.user_id && authenticatedUser.role !== "Admin") {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    const deletionResult = await deleteCommentById(commentId);
    return sendResponse(res, 200, "Comment deleted successfully!", { deletedCount: deletionResult });

  } catch (error) {
    operationFailed(error, "Delete Comment!");
  }
};

export {
  createComment,
  updateComment,
  deleteComment
};