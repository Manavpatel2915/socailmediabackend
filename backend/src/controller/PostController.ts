import type { Request, Response } from "express";
import db from "../config/sqldbconnnect";
import { AppError } from "../utils/AppError";
const creatpost = async (
  req: Request,
  res: Response
): Promise<Response> => {


  const user = req.user;

  if (!user) {
    throw new AppError("Unauthorized", 401);

  }
  const { title, content, image } = req.body;


  const post = await db.Post.create({
    title,
    content,
    image,
    user_id: user.user_id,
  });
  return res.status(201).json({
    message: "Post created successfully",
    post,
  });

}

const getpost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const postid = Number(req.params.postid);
  if (!postid) {
    throw new AppError("Invalid post id", 400);
  }

  const post_user_comment = await db.Post.findOne({
    where: {
      post_id: postid,
    },
    include: [
      {
        model: db.User,
        attributes: ["user_name"],
        as: "user"
      },
      {
        model: db.Comment,
        attributes: ["Comment"],
        as: "comments"
      }
    ],

  })
  if (!post_user_comment) {
    throw new AppError("Post not found", 404);
  }
  return res.status(201).send({
    post_user_comment,
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
  const postid = Number(req.params.postid);
  const Post = await db.Post.findByPk(postid);
  console.log("🚀 ~ deletepost ~ Post:", Post)

  if (!Post) {
    throw new AppError("Post not found", 404);
  }
  if (Post.user_id !== user.user_id) {
    throw new AppError("Not authorized to delete this post", 403);
  }
  const comments = await db.Comment.findAll({
    where: {
      post_id: postid
    }
  });

  const comment_id = comments.map(item => item.id);
  const deteled_comment = await db.Comment.destroy({
    where: {
      id: comment_id
    }
  });


  const delete_post = await db.Post.destroy({
    where: {
      post_id: postid
    }
  });



  return res.status(200).json({
    Post,
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
  const postid = Number(req.params.postid);
  const data = req.body;
  const Post = await db.Post.findByPk(postid);
  if (!Post) {
    throw new AppError("Post not found", 404);
  }
  if (Post.user_id !== user.user_id) {
    throw new AppError("Not authorized to update this post", 403);
  }


  const updated_data = await Post.update(data);
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