import redis from "../config/databases/redis-connect";
import { env } from "../config/env.config";
import { sendResponse } from "../utils/response";
import { Request, Response, NextFunction } from "express";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const key = `${clientIP}:request_count`;

  const request_count = await redis.incr(key);

  if (request_count == 1) {
    await redis.expire(key, Number(env.RATELIMIT.RATE_TIMER));
  }

  const timeRemaining = await redis.ttl(key);

  if (request_count > Number(env.RATELIMIT.RATE_LIMIT)) {
    return sendResponse(res, 429, `too many  request please try again into ${timeRemaining}`);
  }

  next();
}