
import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import {
  createPost,
  getPostById,
  findPostById,
  deletePostWithComments,
  updatePostData
} from "../services/post-service";
import { sendResponse } from '../utils/respones';
import { ERRORS, operationFailed, IdNotFound } from '../const/error-message';

const createNewPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
    }

    const { title, content, image } = req.body;

    const newPost = await createPost(title, content, image, authenticatedUser.user_id);
    return sendResponse(res, 201, "Post created successfully!", newPost);

  } catch (error) {
    operationFailed(error, "Create Post!");
  }
}

const getPostDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const postId = Number(req.params.postid);

    if (!postId) {
      const error = IdNotFound("PostId");
      throw new AppError(error.message, error.statusCode);
    }

    const post = await getPostById(postId);

    if (!post) {
      throw new AppError(ERRORS.NOT_FOUND("Post"), 404);
    }

    return sendResponse(res, 200, "Post fetched successfully!", post);

  } catch (error) {
    operationFailed(error, "Get Post!");
  }
}

const deletePostById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
    }

    const postId = Number(req.params.postid);

    if (!postId) {
      const error = IdNotFound("PostId");
      throw new AppError(error.message, error.statusCode);
    }

    const postToDelete = await findPostById(postId);

    if (!postToDelete) {
      throw new AppError(ERRORS.NOT_FOUND("Post"), 404);
    }

    if (postToDelete.user_id !== authenticatedUser.user_id) {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    const deletionResult = await deletePostWithComments(postId);
    return sendResponse(res, 200, "Post deleted successfully!", deletionResult);

  } catch (error) {
    operationFailed(error, "Delete Post!");
  }
}

const updatePostById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
    }

    const postId = Number(req.params.postid);

    if (!postId) {
      const error = IdNotFound("PostId");
      throw new AppError(error.message, error.statusCode);
    }

    const updateData = req.body;
    const postToUpdate = await findPostById(postId);

    if (!postToUpdate) {
      throw new AppError(ERRORS.NOT_FOUND("Post"), 404);
    }

    if (postToUpdate.user_id !== authenticatedUser.user_id) {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    const updatedPost = await updatePostData(postToUpdate, updateData);
    return sendResponse(res, 200, "Post updated successfully!", updatedPost);

  } catch (error) {
    operationFailed(error, "Update Post!");
  }
}

export {
  createNewPost,
  getPostDetails,
  deletePostById,
  updatePostById
}