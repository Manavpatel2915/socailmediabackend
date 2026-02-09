import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import {createPost,PostData,findPostById,deletePost,updatePost} from "../services/post-service";
// import { ErrorMessages, ERRORS } from './error.message';
import {ERRORS,operationFailed,IdNotFound} from '../const/error-message';

const creatpost = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try{

  const user = req.user;

  if (!user) {
    throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
  }
  const { title, content, image } = req.body;

  const post = await createPost(title,content,image,user.user_id); 
  return res.status(201).json({
    message: "Post created successfully",
    post,
  });
}catch (error) {
    if (error instanceof AppError) throw error;
    const err = operationFailed("create post");
    throw new AppError(err.message, err.statusCode);
  }

}

const getpost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try{

  
  const postId = Number(req.params.postid);

  if (!postId) {
    const error =IdNotFound("PostId");
      throw new AppError(error.message, error.statusCode);
  }

  const postData = await PostData(postId);
  if (!postData) {
      throw new AppError(ERRORS.POST_NOT_FOUND.message, ERRORS.POST_NOT_FOUND.statusCode);
  }
  return res.status(201).send({
    postData,
    message: "all data get"
  });
  } catch (error) {
    if (error instanceof AppError) throw error;
    const err = operationFailed("get post");
    throw new AppError(err.message, err.statusCode);
  }


}

const deletepost = async (
  req: Request,
  res: Response

): Promise<Response> => {
  try{
  const user = req.user;
  if (!user) {
   throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
  }
  const postId = Number(req.params.postid);
  const Post = await findPostById(postId);
  if (!Post) {
     throw new AppError(ERRORS.POST_NOT_FOUND.message, ERRORS.POST_NOT_FOUND.statusCode);
  }
  if (Post.user_id !== user.user_id) {
    const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
  }

  const deleteData= await deletePost(postId)

  return res.status(200).json({
    deleteData,
    message: "your post deleted scuessfully !"
  })} catch (error) {
    if (error instanceof AppError) throw error;
    const err = operationFailed("delete post");
    throw new AppError(err.message, err.statusCode);
  }



}

const updatepost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try{

  
  const user = req.user;
  if (!user) {
    throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
  }
  const postId = Number(req.params.postid);
  const data = req.body;
  const Post = await findPostById(postId);
  if (!Post) {
   throw new AppError(ERRORS.POST_NOT_FOUND.message, ERRORS.POST_NOT_FOUND.statusCode);
  }
  if (Post.user_id !== user.user_id) {
     const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
  }


  const updated_data = await updatePost(data,Post);
  return res.status(200).json({
    updated_data,
    message: "data updated scessfully"
  })
} catch (error) {
    if (error instanceof AppError) throw error;
    const err =operationFailed("update post");
    throw new AppError(err.message, err.statusCode);
  }
}


export {
  creatpost,
  getpost,
  deletepost,
  updatepost
}