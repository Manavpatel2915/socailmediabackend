import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { ERRORS } from "../const/error-message";
import { env } from "../config/env.config";
import { AppError } from "../utils/AppError";

type AuthUser = {
  user_id: number;
  email?: string;
  role: string;
} & jwt.JwtPayload;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !/^Bearer\s+/i.test(authHeader)) {
    return res.status(401).json({ message: "token is missing!" });
  }

  const token = authHeader.split(" ")[1];

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ message: "token is missing!" });
  }
  try {
    const decoded = jwt.verify(token, env.JWT.JWT_SECRET);
    if (typeof decoded === "string") {
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
    }
    req.user = decoded as AuthUser;
    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "token is missing!"
    return res.status(401).json({ message });
  }
};