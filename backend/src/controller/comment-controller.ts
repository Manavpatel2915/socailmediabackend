import type { Request, Response } from "express";
import {
  findCommentById,
  createcomments,
  updateCommentText,
  deleteCommentById,
  findCommentByPostId
} from "../services/comment-service";
import { AppError } from "../utils/AppError";
import { ERRORS, errorhandler } from '../const/error-message';
import { sendResponse } from '../utils/response';
import { defaultValues } from "../const/const-value";
import redis from "../config/databases/redis-connect";
import { env } from "../config/env.config";
// import { notificationQueues } from "../queues/notification-queues";
import { sendMessage } from "../services/producer";
import { EXCHANGE_TYPE } from "../const/const-value";

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
      throw new AppError(ERRORS.MESSAGE.notFound("PostId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const userId = authenticatedUser ? authenticatedUser.user_id : null;
    const newComment = await createcomments(postId, userId, Comment);
    // const notification_data = {
    //   data: newComment,
    //   title: "CREATE-COMMENT"
    // }
    sendMessage('notification', { msg: 'notification', title: "CREATE-COMMENT", user_id: newComment.user_id, post_id: newComment.post_id, comment: newComment.comment }, EXCHANGE_TYPE);
    // notificationQueues.add('notification',  notification_data);
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

      throw new AppError(ERRORS.MESSAGE.notFound("CommentId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const { Comment } = req.body;
    if (!Comment) {
      throw new AppError(ERRORS.MESSAGE.ALL_FIELDS_REQUIRED, ERRORS.STATUSCODE.ALL_FIELDS_REQUIRED);
    }

    const existingComment = await findCommentById(commentId);
    if (!existingComment) {
      throw new AppError(ERRORS.MESSAGE.notFound("Comment"), 404);
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
      throw new AppError(ERRORS.MESSAGE.notFound("CommentId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const commentToDelete = await findCommentById(commentId);
    if (!commentToDelete) {
      throw new AppError(ERRORS.MESSAGE.notFound("Comment"), 404);
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

const getComment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const postId = Number(req.params.postId);
    const commentLimit = Number(req.query.commentLimit) || defaultValues.DEFAULT_LIMIT;
    const commentOffset = Number(req.query.commentOffset) || defaultValues.DEFAULT_OFFSET;
    const rediskey = req.rediskey;
    if (!postId) {
      throw new AppError(ERRORS.MESSAGE.notFound("post Id"), ERRORS.STATUSCODE.NOT_FOUND);
    }
    const comments = await findCommentByPostId(postId, commentOffset, commentLimit);
    await redis.set(rediskey, JSON.stringify(comments), "EX", Number(env.RATELIMIT.RATE_TIMER))
    return sendResponse(res, 200, "successfully", comments);
  } catch (error) {
    errorhandler(error, "getComments");
  }

}

export {
  createComment,
  updateComment,
  deleteComment,
  getComment
};