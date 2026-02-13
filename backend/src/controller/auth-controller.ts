import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from '../config/env.config';
import { AppError } from "../utils/AppError";
import { createUser, findUserByEmail } from "../services/auth-service";
import { ERRORS, errorhandler } from '../const/error-message';
import { sendResponse } from '../utils/respones';

const JWT_SECRET = env.JWT.JWT_SECRET as string;
const TOKEN_EXPIRY = env.JWT.TOKEN_EXPRI as string;

const registerUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { user_name, email, password, role } = req.body;

    if (!user_name || !email || !password) {
      throw new AppError(ERRORS.message.ALL_FIELDS_REQUIRED, ERRORS.statuscode.ALL_FIELDS_REQUIRED);
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new AppError(ERRORS.message.CONFLICT("User"), ERRORS.statuscode.CONFLICT);
    }

    const newUser = await createUser(user_name, email, password, role);

    const token = jwt.sign(
      { user_id: newUser.user_id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY as "5d" }
    );

    return sendResponse(res, 201, "User registered successfully!", { token });
  } catch (error) {
    errorhandler(error, "Register!");
  }
}

const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      throw new AppError(ERRORS.message.INVALID("Email"), 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(ERRORS.message.INVALID("Password"), 401);
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY as "5d" }
    );

    return sendResponse(res, 200, "Login successful!", { token });
  } catch (error) {
    errorhandler(error, "Login!");
  }
};

export {
  registerUser,
  loginUser,
};