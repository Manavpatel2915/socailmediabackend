import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.config";

type AuthUser = {
  user_id: number;
  email?: string;
  role: string;
} & jwt.JwtPayload;

export const optionalJwt = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // If no auth header, set undefined and continue
  if (!authHeader || !/^Bearer\s+/i.test(authHeader)) {
    req.user = undefined;
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];

    if (!token || typeof token !== 'string') {
      req.user = undefined;
      return next();
    }

    if (!env.JWT.JWT_SECRET) {
      req.user = undefined;
      return next();
    }

    const decoded = jwt.verify(token, env.JWT.JWT_SECRET);
    if (typeof decoded === "string") {
      req.user = undefined;
      return next();
    }

    req.user = decoded as AuthUser;
  } catch {
    req.user = undefined;
  }

  next();
};