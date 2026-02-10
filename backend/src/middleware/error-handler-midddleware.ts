import { Request, Response, NextFunction } from "express";
import { ErrorLog } from "../config/models/mongodb-Models/error-log";

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await ErrorLog.create({
      method: req.method,
      url: req.originalUrl,
      status: err.statusCode,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      errorMessage: err.message,
      errorStack: err.stack,
      errorType: err.name,
    });

  } catch (logError) {
    console.error("Error saving error log:", logError);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};
