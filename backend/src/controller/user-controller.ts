import type { Request, Response  } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { AppError } from "../utils/AppError";
import {createUser,findUserByEmail,deleteUserById,findUserById} from "../services/user-service";
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
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

   const user = await createUser(user_name, email, password, role);

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn:process.env.TOKEN_EXPRI as "5d" }
    );
    return res.status(201).json({
      token,
      user: {
        id: user.user_id,
        username: user.user_name,
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

  const user = await findUserByEmail(email);


  if (!user) {
    throw new AppError("Invalid email ", 401);
  }
  
  const isMatch = await bcrypt.compare(
    password,
    user.password
  );
  if (!isMatch) {
    throw new AppError("Invalid  password", 401);
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
  
   const existingUser = await findUserById(user.user_id);
    if (!existingUser) {
    throw new AppError("User not found", 404);
  }
  if(existingUser.user_id !== user.user_id){
    throw new AppError("Not authorized to delete this account", 403);
  }

  const result = await deleteUserById(user.user_id);

    return res.status(201).json({
   result,
    message : "delete user sucessfully "
  });
  
}


  

export { register, 
          login,
          deleteuser,
         };
