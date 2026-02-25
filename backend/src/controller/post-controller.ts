import  { Post } from "../config/models/sql-models/post-model";
import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import {
  createPost,
  findPostByIdWithUsername,
  deletePostWithComments,
  updatePostData,
  findPostById,
  getallpost
} from "../services/post-service";
import { sendResponse } from '../utils/respones';
import { ERRORS, errorhandler } from '../const/error-message';
import { defultvalues } from "../const/defult-limit";
import { env } from "../config/env.config";
import redis from "../config/databases/redis";

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
    const rediskey = req.rediskey;
    if (!postId) {
      throw new AppError(ERRORS.MESSAGE.not_found("PostId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const post = await findPostByIdWithUsername(postId);

    if (!post) {
      throw new AppError(ERRORS.MESSAGE.not_found("Post"), ERRORS.STATUSCODE.NOT_FOUND);
    }
    await redis.set(rediskey, JSON.stringify(post), "EX", Number(env.RATELIMIT.REAT_TIMER))
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
      throw new AppError(ERRORS.MESSAGE.not_found("PostId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const postToDelete = await findPostById(postId);

    if (!postToDelete) {
      throw new AppError(ERRORS.MESSAGE.not_found("Post"), 404);
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
    console.log("🚀 ~ updatePostById ~ authenticatedUser:", authenticatedUser)

    const { title, content } = req.body;
    const image = req.file as Express.Multer.File;
    console.log("🚀 ~ updatePostById ~ image:", image)
    const postId = Number(req.params.postId);
    console.log("🚀 ~ updatePostById ~ postId:", postId)

    if (!postId) {
      throw new AppError(ERRORS.MESSAGE.invalid("PostId"), ERRORS.STATUSCODE.UNAUTHORIZED);
    }

    const postToUpdate = await findPostById(postId);
    console.log("🚀 ~ updatePostById ~ postToUpdate:", postToUpdate)
    if (!postToUpdate) {
      throw new AppError(ERRORS.MESSAGE.not_found("Post"), 404);
    }
    const dataToUpdate: Partial<Post> = {};
    if (title) dataToUpdate.title = title ;
    if (content) dataToUpdate.content = content ;
    if (image) dataToUpdate.image = image.path;
    if (postToUpdate.user_id !== authenticatedUser.user_id) {
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
    }

    const updatedPost = await updatePostData(postToUpdate, dataToUpdate);
    console.log("🚀 ~ updatePostById ~ updatedPost:", updatedPost)
    return sendResponse(res, 200, "Post updated successfully!", updatedPost);

  } catch (error) {
    errorhandler(error, "Update Post!");
  }
}

const allpost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const postLimit = Number(req.query.postLimit) || defultvalues.DEFULT_LIMIT;
  const postOffset = Number(req.query.postOffset) || defultvalues.DEFULT_OFFSET;
  const { orderBy, filter } = req.body;
  const rediskey = req.rediskey;
  try {
    const postdata = await getallpost(postLimit, postOffset, orderBy, filter);
    await redis.set(rediskey, JSON.stringify(postdata), "EX", Number(env.RATELIMIT.REAT_TIMER));
    return sendResponse(res, 200, `All Data Fetch`, postdata);
  } catch (error) {
    errorhandler(error, "Fetch Data!");
  }
}

export {
  createNewPost,
  getPost,
  deletePostById,
  updatePostById,
  allpost,
}