import type { Request, Response } from "express";
import {
  findCommentById,
  createNewComment,
  updateCommentText,
  deleteCommentById,
  findCommentByPostId
} from "../services/comment-service";
import { AppError } from "../utils/AppError";
import { ERRORS, errorhandler } from '../const/error-message';
import { sendResponse } from '../utils/respones';
import { defultvalues } from "../const/defult-limit";
const createComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;
    const { Comment } = req.body;

    if (!Comment) {
      throw new AppError(ERRORS.MESSAGE.ALL_FIELDS_REQUIRED, ERRORS.STATUSCODE.ALL_FIELDS_REQUIRED);
    }

    const postId = Number(req.params.postId);
    if (!postId) {
      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("PostId"), ERRORS.STATUSCODE.NOT_FOUND);
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
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
    }

    const commentId = Number(req.params.commentId);
    if (!commentId) {

      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("CommentId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const { Comment } = req.body;
    if (!Comment) {
      throw new AppError(ERRORS.MESSAGE.ALL_FIELDS_REQUIRED, ERRORS.STATUSCODE.ALL_FIELDS_REQUIRED);
    }

    const existingComment = await findCommentById(commentId);
    if (!existingComment) {
      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("Comment"), 404);
    }

    if (existingComment.user_id !== authenticatedUser.user_id && authenticatedUser.role !== 'Admin') {
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
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
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
    }

    const commentId = Number(req.params.commentId);
    if (!commentId) {
      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("CommentId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const commentToDelete = await findCommentById(commentId);
    if (!commentToDelete) {
      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("Comment"), 404);
    }

    if (commentToDelete.user_id !== authenticatedUser.user_id && authenticatedUser.role !== "Admin") {
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
    }

    const deletionResult = await deleteCommentById(commentId);
    return sendResponse(res, 200, "Comment deleted successfully!", { deletedCount: deletionResult });

  } catch (error) {
    errorhandler(error, "Delete Comment!");
  }
};

const getcomment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const postId = Number(req.params.postId);
    const commentLimit = Number(req.query.commentLimit) || defultvalues.DEFULT_LIMIT;
    const commentOffset = Number(req.query.commentOffset) || defultvalues.DEFULT_OFFSET;

    if (!postId) {
      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("post Id"), ERRORS.STATUSCODE.NOT_FOUND);
    }
    const comments = await findCommentByPostId(postId, commentOffset, commentLimit);
    return sendResponse(res, 200, "sucess", comments);
  } catch (error) {
    errorhandler(error, "getcomments");
  }

}

export {
  createComment,
  updateComment,
  deleteComment,
  getcomment
};