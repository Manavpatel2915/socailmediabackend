import type { Request, Response  } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { AppError } from "../utils/AppError";
import {createUser,findUserByEmail,deleteUserById,findUserById} from "../services/user-service";
import {ERRORS,operationFailed} from '../const/error-message';
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET as string;


const register = async (
  req: Request,
  res: Response,

): Promise<Response> => {

  try{

    const { user_name, email, password, role } = req.body;

  if (!user_name || !email || !password) {
     const error = ERRORS.ALL_FIELDS_REQUIRED;
     throw new AppError(error.message, error.statusCode);
  }
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      const error = ERRORS.USER_EXISTS;
      throw new AppError(error.message, error.statusCode);
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
  }catch(error){
    if (error instanceof AppError) throw error;
    const err = operationFailed("register user!");
    throw new AppError(err.message, err.statusCode);
  }
};

const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try{

  const { email, password } = req.body;

  const user = await findUserByEmail(email);


  if (!user) {
      throw new AppError(ERRORS.INVALID_EMAIL.message, ERRORS.INVALID_EMAIL.statusCode);
  }
  
  const isMatch = await bcrypt.compare(
    password,
    user.password
  );
  if (!isMatch) {
    throw new AppError(ERRORS.INVALID_PASSWORD.message, ERRORS.INVALID_PASSWORD.statusCode);
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
}catch (error) {
    if (error instanceof AppError) throw error;
    const err = operationFailed("login User!");
    throw new AppError(err.message, err.statusCode);
  }
};

const deleteuser = async(
  req:Request,
  res:Response
):Promise<Response> =>{
  try{

  
  const user = req.user;
  if (!user) {
   throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
  }
  
   const existingUser = await findUserById(user.user_id);
    if (!existingUser) {
   throw new AppError(ERRORS.USER_NOT_FOUND.message, ERRORS.USER_NOT_FOUND.statusCode);
  }
  if(existingUser.user_id !== user.user_id){
    const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
  }

  const result = await deleteUserById(user.user_id);

    return res.status(201).json({
   result,
    message : "delete user sucessfully "
  });
}catch (error) {
    if (error instanceof AppError) throw error;
    const err = operationFailed("delete User!");
    throw new AppError(err.message, err.statusCode);
  }
}


export { register, 
          login,
          deleteuser,
         };
