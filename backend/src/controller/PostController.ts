import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../config/sqldbconnnect";
import { model } from "mongoose";
import { where } from "sequelize";
import { log } from "console";
const JWT_SECRET = process.env.JWT_SECRET as string;

const creatpost = async(
    req:Request,
    res:Response
):Promise<Response>=>{

   try{
    const user = req.user as any;
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {title,content,image,like} = req.body;
    if(!title || !content || !image ){
         return res.status(400).json({ message: "All fields are required" });
    }

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
catch (error) {
    return res.status(500).json({
      message: "Failed to create post",
    });
  }
}

const getpost = async(
    req:Request,
    res:Response
):Promise<Response>=>{
  const postid = Number(req.params.postid);
  
  
  
  const post_user_comment = await db.Post.findOne({
    where:{
      post_id :postid,
    },
    include:[
      {
        model :db.User,
        attributes:["username"],
        
      },
      {
      model :db.Comment,
      attributes:["Comment"]
    }
    ],
   
  })
  return res.status(201).send({
    post_user_comment,
    message : "hello"
  });
}
const deletepost = async(
  req:Request,
  res:Response
    
):Promise<Response>=>{
 
  try{
 const user = req.user as any ;
  const postid = Number(req.params.postid);
   const Post = await db.Post.findByPk(postid);

     if(!Post) {
    return res.status(404).json({
      message : "post not found "
    })
  }
   if(Post.user_id !== user.user_id  ){
    return res.status(401).json({
      message : "you have not Authorized to delete this post "
    })
  }
   const comments = await db.Comment.findAll({
    where :{
      post_id : postid
    }
  });
  
  const comment_id = comments.map(item=>item.id);
  const deteled_comment =await db.Comment.destroy({
  where: {
    id: comment_id
  }
});
  

  const delete_post = await db.Post.destroy({
    where :{
      post_id : postid
    }
  });
  
  

    return res.status(200).json({
      message : "your post deleted scuessfully !"
    })

  }catch (error: unknown) {
    return res.status(500).json({
      message: "Failed to delete post and comment ",
      error: error instanceof Error ? error.message : error,
    });
  }
  
}

const updatepost = async(
  req:Request,
  res:Response
):Promise<Response> =>{
  const user = req.user as any;
  const postid =Number(req.params.postid);
  const data = req.body;
  const Post = await db.Post.findByPk(postid);
    if(!Post) {
    return res.status(404).json({
      message : "post not found "
    })
  }
  if(Post.user_id !== user.user_id  ){
    return res.status(401).json({
      message : "you have not Authorized to update this post "
    })
  }

  if(!data){
    return res.status(500).json({
      message : "data not found!"
    })
  }

  const updated_data= await Post.update( data );
  return res.status(200).json({
    updated_data,
    message : "data updated scessfully"
  })
}
export {
    creatpost,
    getpost,
    deletepost,
    updatepost
}