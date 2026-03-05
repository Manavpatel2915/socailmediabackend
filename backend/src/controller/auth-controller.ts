import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from '../config/env.config';
import { AppError } from "../utils/AppError";
import { createUser, findUserByEmail } from "../services/auth-service";
import { ERRORS, errorhandler } from '../const/error-message';
import { sendResponse } from '../utils/response';
import { sendMail } from '../services/mail-service';

const JWT_SECRET = env.JWT.JWT_SECRET as string;
const TOKEN_EXPIRY = env.JWT.TOKEN_EXPIRY as string;

const registerUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {

  try {
    const { user_name, email, password, role } = req.body;

    if (!user_name || !email || !password) {
      throw new AppError(ERRORS.MESSAGE.ALL_FIELDS_REQUIRED, ERRORS.STATUSCODE.ALL_FIELDS_REQUIRED);
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new AppError(ERRORS.MESSAGE.conflict("User"), ERRORS.STATUSCODE.CONFLICT);
    }

    const newUser = await createUser(user_name, email, password, role);

    const token = jwt.sign(
      { user_id: newUser.user_id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY as "5d" }
    );
    await sendMail({
      to: `${email}`,
      subject: "Welcome!",
      text: `Welcome ${user_name} your account created Successfully`
    })
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
      throw new AppError(ERRORS.MESSAGE.invalid("Email"), 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(ERRORS.MESSAGE.invalid("Password"), 401);
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