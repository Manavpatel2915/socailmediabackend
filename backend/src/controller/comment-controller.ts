import type { Request, Response } from "express";
import {
  findCommentById,
  createNewComment,
  updateCommentText,
  deleteCommentById
} from "../services/comment-service";
import { AppError } from "../utils/AppError";
import { ERRORS, errorhandler } from '../const/error-message';
import { sendResponse } from '../utils/respones';

const createComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;
    const { Comment } = req.body;

    if (!Comment) {
      throw new AppError(ERRORS.message.ALL_FIELDS_REQUIRED, ERRORS.statuscode.ALL_FIELDS_REQUIRED);
    }

    const postId = Number(req.params.postId);
    if (!postId) {
      throw new AppError(ERRORS.message.NOT_FOUND("PostId"), ERRORS.statuscode.NOT_FOUND);
    }

    const userId = authenticatedUser ? authenticatedUser.user_id : null;
    const newComment = await createNewComment(postId, userId, Comment);

    return sendResponse(res, 201, "Comment created successfully!", newComment);
  } catch (error) {
    errorhandler(error, "Create Comment!");
  }
};

const updateComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      throw new AppError(ERRORS.message.UNAUTHORIZED, ERRORS.statuscode.UNAUTHORIZED);
    }

    const commentId = Number(req.params.commentId);
    if (!commentId) {

      throw new AppError(ERRORS.message.NOT_FOUND("CommentId"), ERRORS.statuscode.NOT_FOUND);
    }

    const { Comment } = req.body;
    if (!Comment) {
      throw new AppError(ERRORS.message.ALL_FIELDS_REQUIRED, ERRORS.statuscode.ALL_FIELDS_REQUIRED);
    }

    const existingComment = await findCommentById(commentId);
    if (!existingComment) {
      throw new AppError(ERRORS.message.NOT_FOUND("Comment"), 404);
    }

    if (existingComment.user_id !== authenticatedUser.user_id && authenticatedUser.role !== 'Admin') {
      throw new AppError(ERRORS.message.UNAUTHORIZED, ERRORS.statuscode.UNAUTHORIZED);
    }

    const updatedComment = await updateCommentText(existingComment, Comment);
    return sendResponse(res, 200, "Comment updated successfully!", updatedComment);

  } catch (error) {
    errorhandler(error, "Update Comment!");
  }
};

const deleteComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      throw new AppError(ERRORS.message.UNAUTHORIZED, ERRORS.statuscode.UNAUTHORIZED);
    }

    const commentId = Number(req.params.commentId);
    if (!commentId) {
      throw new AppError(ERRORS.message.NOT_FOUND("CommentId"), ERRORS.statuscode.NOT_FOUND);
    }

    const commentToDelete = await findCommentById(commentId);
    if (!commentToDelete) {
      throw new AppError(ERRORS.message.NOT_FOUND("Comment"), 404);
    }

    if (commentToDelete.user_id !== authenticatedUser.user_id && authenticatedUser.role !== "Admin") {
      throw new AppError(ERRORS.message.UNAUTHORIZED, ERRORS.statuscode.UNAUTHORIZED);
    }

    const deletionResult = await deleteCommentById(commentId);
    return sendResponse(res, 200, "Comment deleted successfully!", { deletedCount: deletionResult });

  } catch (error) {
    errorhandler(error, "Delete Comment!");
  }
};

export {
  createComment,
  updateComment,
  deleteComment
};