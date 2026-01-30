import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../config/sqldbconnnect";
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
    const { username, email, password, role } = req.body;


  console.log("PASSWORD:", password);
  console.log("REQ BODY:", req.body);
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(500).json({ message: "User already exists" });
    }

    const user = await db.User.create({
      username,
      email,
      password,
      role,
    }); 
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn:process.env.TOKEN_EXPRI as "5d" }
    );

    const tokendata = await db.Token.create({
      genratedtoken : token
    });
    if(!tokendata){
      console.log("not set token data");
    }
    
    return res.status(201).json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Failed to create user",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPRI as "5d" }
  );
   const tokendata = db.Token.create({
      genratedtoken : token
    });
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
  try{
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const User = await db.User.findByPk(user.user_id);
   if(!User){
    return res.status(404).json({
      message : "user not found "
    })
  }
  if(User.user_id !== user.user_id  ){
    return res.status(401).json({
      message : "you have not Authorized to delete this account "
    })
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
  }catch (error: unknown) {
    return res.status(500).json({
      message: "Failed to delete user",
      error: error instanceof Error ? error.message : error,
    });
  }
}


  

export { register, 
          login,
          deleteuser,
         };
