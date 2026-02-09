
import type { Request, Response } from "express";
import { findCommentById, createComment, updateComment, deletedComment } from "../services/comment-service";
import { AppError } from "../utils/AppError";
import {ERRORS,operationFailed,IdNotFound} from '../const/error-message';

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

    return res.status(201).json({
      message: "Comment created successfully",
      commentData,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    const err = operationFailed("create comment");
    throw new AppError(err.message, err.statusCode);
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
      throw new AppError(ERRORS.COMMENT_NOT_FOUND.message, ERRORS.COMMENT_NOT_FOUND.statusCode);
    }

    if (existingComment.user_id !== user.user_id && user.role !== 'Admin') {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    await updateComment(existingComment, Comment);

    return res.status(200).json({
      message: "Comment updated successfully"
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    const err =operationFailed("update comment");
    throw new AppError(err.message, err.statusCode);
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
      const error =IdNotFound("comment Id not Found!!");
      throw new AppError(error.message, error.statusCode);
    }

    const comment = await findCommentById(commentId);
    if (!comment) {
      throw new AppError(ERRORS.COMMENT_NOT_FOUND.message, ERRORS.COMMENT_NOT_FOUND.statusCode);
    }

    if (comment.user_id !== user.user_id && user.role !== "Admin") {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    await deletedComment(commentId);

    return res.status(200).json({
      message: "Comment deleted successfully"
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    const err = operationFailed("delete comment");
    throw new AppError(err.message, err.statusCode);
  }
};

export {
  createcomment,
  updatecomment,
  deletecomment
};