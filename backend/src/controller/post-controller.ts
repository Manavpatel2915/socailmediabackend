import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import {createPost,PostData,findPostById,deletePost,updatePost} from "../services/post-service";


const creatpost = async (
  req: Request,
  res: Response
): Promise<Response> => {


  const user = req.user;

  if (!user) {
    throw new AppError("Unauthorized", 401);

  }
  const { title, content, image } = req.body;


  const post = await createPost(title,content,image,user.user_id); 
  return res.status(201).json({
    message: "Post created successfully",
    post,
  });

}

const getpost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const postId = Number(req.params.postid);
  if (!postId) {
    throw new AppError("Invalid post id", 400);
  }

  const postData = await PostData(postId);
  if (!postData) {
    throw new AppError("Post not found", 404);
  }
  return res.status(201).send({
    postData,
    message: "all data get"
  });



}

const deletepost = async (
  req: Request,
  res: Response

): Promise<Response> => {


  const user = req.user;
  if (!user) {
    throw new AppError("Unauthorized", 401);
  }
  const postId = Number(req.params.postid);
  const Post = await findPostById(postId);
  if (!Post) {
    throw new AppError("Post not found", 404);
  }
  if (Post.user_id !== user.user_id) {
    throw new AppError("Not authorized to delete this post", 403);
  }

  const deleteData= await deletePost(postId)

  return res.status(200).json({
    deleteData,
    message: "your post deleted scuessfully !"
  })



}

const updatepost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = req.user;
  if (!user) {
    throw new AppError("Unauthorized", 401);
  }
  const postId = Number(req.params.postid);
  const data = req.body;
  const Post = await findPostById(postId);
  if (!Post) {
    throw new AppError("Post not found", 404);
  }
  if (Post.user_id !== user.user_id) {
    throw new AppError("Not authorized to update this post", 403);
  }


  const updated_data = await updatePost(data,Post);
  return res.status(200).json({
    updated_data,
    message: "data updated scessfully"
  })
}


export {
  creatpost,
  getpost,
  deletepost,
  updatepost
}