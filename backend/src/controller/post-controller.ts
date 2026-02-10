import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { createPost, PostData, findPostById, deletePost, updatePost } from "../services/post-service";
import { sendResponse } from '../utils/respones';
import { ERRORS, operationFailed, IdNotFound } from '../const/error-message';

const creatpost = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {

  const user = req.user;

  if (!user) {
    throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
  }
  const { title, content, image } = req.body;

  const post = await createPost(title, content, image, user.user_id);
  return sendResponse(res, 201, "Post created!", post);

} catch (error){
    operationFailed(error, "Create Post!");
}
}

const getpost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {


  const postId = Number(req.params.postid);

  if (!postId) {
    const error = IdNotFound("PostId");
      throw new AppError(error.message, error.statusCode);
  }

  const postData = await PostData(postId);
  if (!postData) {
      throw new AppError(ERRORS.NOT_FOUND("Post"), 404);
  }
  return sendResponse(res, 201, "PostData!", postData);

  } catch (error){
    operationFailed(error, "GetPost!");
}


}

const deletepost = async (
  req: Request,
  res: Response

): Promise<Response> => {
  try {
  const user = req.user;
  if (!user) {
   throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
  }
  const postId = Number(req.params.postid);
  const Post = await findPostById(postId);
  if (!Post) {
     throw new AppError(ERRORS.NOT_FOUND("Post"), 404);
  }
  if (Post.user_id !== user.user_id) {
    const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
  }

  const deleteData = await deletePost(postId)
  return sendResponse(res, 200, "Post Deleted ", deleteData);
 } catch (error){
    operationFailed(error, "Delete Post!");
}



}

const updatepost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {


  const user = req.user;
  if (!user) {
    throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
  }
  const postId = Number(req.params.postid);
  const data = req.body;
  const Post = await findPostById(postId);
  if (!Post) {
   throw new AppError(ERRORS.NOT_FOUND("Post"), 404);
  }
  if (Post.user_id !== user.user_id) {
     const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
  }


  const updateddata = await updatePost(data, Post);
  return sendResponse(res, 200, "Update Post successfully ", updateddata);
} catch (error){
    operationFailed(error, "Update Post!");
}
}


export {
  creatpost,
  getpost,
  deletepost,
  updatepost
}