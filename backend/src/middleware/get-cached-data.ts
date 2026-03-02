import { Request, Response, NextFunction } from "express";
import redis from "../config/databases/redis-connect";
import { sendResponse } from "../utils/response";

export const getCachedData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return next();
    }

    const route = req.originalUrl.split("?")[0].replace(/\//g, ":");
    const queryString = JSON.stringify(req.query);

    const cacheKey = `user:${authenticatedUser.user_id}${route}:q:${queryString}`;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return sendResponse(
        res,
        200,
        "User Data Fetched Successfully! (From Cache)",
        JSON.parse(cachedData)
      );
    }
    req.rediskey = cacheKey;
    next();
  } catch (error) {
    console.error("Redis error:", error);
    next();
  }
};