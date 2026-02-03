import type { Request, Response  } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../config/sqldbconnnect";
import dotenv from 'dotenv';
import { AppError } from "../utils/AppError";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;


const register = async (
  req: Request,
  res: Response,

): Promise<Response> => {
    const { user_name, email, password, role } = req.body;

  if (!user_name || !email || !password) {
     throw new AppError("All fields are required", 400);
  }

  
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const user = await db.User.create({
      user_name,
      email,
      password,
      role,
    }); 
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn:process.env.TOKEN_EXPRI as "5d" }
    );

    
    
    return res.status(201).json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  
};

const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPRI as "5d" }
  );
   
  return res.json({
    token,
    message : "token is set to the db",
    user: {
      id: user.user_id,
      email: user.email,
      role: user.role,
    },
  });
};

const deleteuser = async(
  req:Request,
  res:Response
):Promise<Response> =>{
  
  const user = req.user;
  if (!user) {
   throw new AppError("Unauthorized", 401);
  }
  
  const User = await db.User.findByPk(user.user_id);
   if(!User){
     throw new AppError("User not found", 404);
  }
  if(User.user_id !== user.user_id  ){
    throw new AppError("Not authorized to delete this account", 403);
  }
 
  const comments = await db.Comment.findAll({
    where: {
      user_id : user.user_id
    }
  });
  const comment_id = comments.map(item=>item.id);
  const deteled_comment =await db.Comment.destroy({
  where: {
    id: comment_id
  }
}); 

   const posts = await db.Post.findAll({
    where: {
      user_id : user.user_id
    }
  });
  const post_id = posts.map((item) => item.post_id);
  const deleted_post = await db.Post.destroy({
    where:{
      post_id : post_id
    }
  })

  const deletedUser = await db.User.destroy({
    where : {
      user_id :User.user_id
    }
  })
    return res.status(201).json({
    deletedUser,
    deleted_post,
    deteled_comment,
    message : "delete user sucessfully "
  });
  
}


  

export { register, 
          login,
          deleteuser,
         };
