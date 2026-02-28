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
import { creatPostQueues } from "../queues/createPostQueues";

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
      throw new AppError(ERRORS.MESSAGE.notFound("PostId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const post = await findPostByIdWithUsername(postId);

    if (!post) {
      throw new AppError(ERRORS.MESSAGE.notFound("Post"), ERRORS.STATUSCODE.NOT_FOUND);
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
      throw new AppError(ERRORS.MESSAGE.notFound("PostId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const postToDelete = await findPostById(postId);

    if (!postToDelete) {
      throw new AppError(ERRORS.MESSAGE.notFound("Post"), 404);
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
      throw new AppError(ERRORS.MESSAGE.invalid("PostId"), ERRORS.STATUSCODE.UNAUTHORIZED);
    }

    const postToUpdate = await findPostById(postId);
    if (!postToUpdate) {
      throw new AppError(ERRORS.MESSAGE.notFound("Post"), 404);
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

const allPost = async (
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

const createNewPostAtSepicficTime = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const time = req.query.time as string;
    const authenticatedUser = req.user;
    const userId = authenticatedUser.user_id;
    const { title, content } = req.body;
    const images = req.file as Express.Multer.File;
    const image = images.path;
    const scheduledTime = new Date(time).getTime();
    const now = Date.now();
    console.log(`${scheduledTime - now}`);
    creatPostQueues.add('creatPost', { title, content, image, userId }, {
      delay: scheduledTime - now,
      // repeat: {
      //   pattern: '* * * * *'
      // }
    });
    return sendResponse(res, 200, `post created at ${scheduledTime - now}`);
  } catch (error) {
    errorhandler(error, "CreatePost");
  }
}
export {
  createNewPost,
  getPost,
  deletePostById,
  updatePostById,
  allPost as allpost,
  createNewPostAtSepicficTime
}