import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../config/sqldbconnnect";
import { model } from "mongoose";
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
    res:Response,
    req:Request
):Promise<Response>=>{
  return res.status(200).json({
    messsage :  "delete post succesfully"
  })
}
export {
    creatpost,
    getpost,
    deletepost
}