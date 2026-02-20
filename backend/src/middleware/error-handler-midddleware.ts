import { Request, Response, NextFunction } from "express";
import { ErrorLog } from "../config/models/mongodb-Models/error-log";
import { env } from "../config/env.config";
import path from 'path';
import fs from 'fs';
import fsPromises from "fs/promises";
import { mounth } from "../const/mounth";
import { AppError } from "../utils/AppError";
export const errorHandler = async (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const LOG_PLACE = env.LOG.LOG_PLACE;
  const data = {
    method: req.method,
    url: req.originalUrl,
    status: err.statusCode,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    errorMessage: err.message,
    errorStack: err.stack,
    errorType: err.name,
  };

  if (LOG_PLACE) {
    try {
      const year = new Date().getFullYear().toString();
      const month = mounth[(new Date().getMonth() + 1)].toString();
      const dirname = path.resolve("src", "log", year, month);
      fs.mkdirSync(dirname, { recursive: true });
      await fsPromises.appendFile(path.join(dirname, "error-log.txt"), JSON.stringify(data) +  '\n', 'utf8');
    } catch (error) {
      console.error("Failed to save error log into FILESYSTEM", error);
    }
  } else {
    try {
      await ErrorLog.create(data);

    } catch (error) {
      console.error("Error saving error log:", error);
    }
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};
