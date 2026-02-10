
import type { Request, Response  } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from '../config/env.config';
import { AppError } from "../utils/AppError";
import { createUser, findUserByEmail } from "../services/auth-service";
import { ERRORS, operationFailed } from '../const/error-message';
import { sendResponse } from '../utils/respones';

const JWT_SECRET = env.DB.JWT_SECRET as string;

const register = async (
  req: Request,
  res: Response,

): Promise<Response> => {

  try {

    const { user_name, email, password, role } = req.body;

  if (!user_name || !email || !password) {
     const error = ERRORS.ALL_FIELDS_REQUIRED;
     throw new AppError(error.message, error.statusCode);
  }
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new AppError(ERRORS.EXISTS("User"), 404);
    }

   const user = await createUser(user_name, email, password, role);

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn:env.DB.TOKEN_EXPRI as "5d" }
    );
    return sendResponse(res, 201, "Registerd Sucessfully", { token });
  } catch (error){
    operationFailed(error, "Register!");
};
}
const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {

  const { email, password } = req.body;

  const user = await findUserByEmail(email);


  if (!user) {
      throw new AppError(ERRORS.INVALID("Email"), 401);
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );
  if (!isMatch) {
    throw new AppError(ERRORS.INVALID("Password"), 401);
  }

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    JWT_SECRET,
    { expiresIn: env.DB.TOKEN_EXPRI as "5d" }
  );
    return sendResponse(res, 200, "Login Sucessfully", { token });
} catch (error) {
  operationFailed(error, "Login!");
}
};
export { register,
          login,
         };