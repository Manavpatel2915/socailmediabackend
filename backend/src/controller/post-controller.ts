import  { Post } from "../config/models/sql-models/post-model";
import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import {
  createPost,
  findPostByIdWithUsername,
  deletePostWithComments,
  updatePostData,
  findPostById
} from "../services/post-service";
import { sendResponse } from '../utils/respones';
import { ERRORS, errorhandler } from '../const/error-message';
const createNewPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;
    const { title, content } = req.body;
    const image = req.file as Express.Multer.File;
    const newPost = await createPost(title, content, image.path, authenticatedUser.user_id);
    return sendResponse(res, 201, "Post created successfully!", newPost);

  } catch (error) {
    errorhandler(error, "Create Post!");
  }
}

const getPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const postId = Number(req.params.postId);
    if (!postId) {
      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("PostId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const post = await findPostByIdWithUsername(postId);

    if (!post) {
      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("Post"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    return sendResponse(res, 200, "Post fetched successfully!", post);

  } catch (error) {
    errorhandler(error, "Get Post!");
  }
}

const deletePostById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    const postId = Number(req.params.postId);

    if (!postId) {
      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("PostId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const postToDelete = await findPostById(postId);

    if (!postToDelete) {
      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("Post"), 404);
    }

    if (postToDelete.user_id !== authenticatedUser.user_id) {
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
    }

    const deletionResult = await deletePostWithComments(postId);

    return sendResponse(res, 200, "Post deleted successfully!", deletionResult);

  } catch (error) {
    errorhandler(error, "Delete Post!");
  }
}

const updatePostById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    const { title, content } = req.body;
    const image = req.file as Express.Multer.File;
    const postId = Number(req.params.postId);

    if (!postId) {
      throw new AppError(ERRORS.MESSAGE.INVALID("PostId"), ERRORS.STATUSCODE.UNAUTHORIZED);
    }

    const postToUpdate = await findPostById(postId);
    if (!postToUpdate) {
      throw new AppError(ERRORS.MESSAGE.NOT_FOUND("Post"), 404);
    }
    const dataToUpdate: Partial<Post> = {};
    if (title) dataToUpdate.title = title ;
    if (content) dataToUpdate.content = content ;
    if (image) dataToUpdate.image = image.path;
    if (postToUpdate.user_id !== authenticatedUser.user_id) {
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
    }

    const updatedPost = await updatePostData(postToUpdate, dataToUpdate);
    return sendResponse(res, 200, "Post updated successfully!", updatedPost);

  } catch (error) {
    errorhandler(error, "Update Post!");
  }
}

export {
  createNewPost,
  getPost,
  deletePostById,
  updatePostById,
}