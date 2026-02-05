import { Request, Response, NextFunction } from "express";
import { RequestLog } from "../config/models/requestlog-mongodbmodel";

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await RequestLog.create({
      method: req.method,
      url: req.originalUrl,
      status: err.statusCode || 500,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      errorMessage: err.message,
      errorStack: err.stack,
      errorType: err.name,
    });
  } catch (logError) {
    console.error("Error saving error log:", logError);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
