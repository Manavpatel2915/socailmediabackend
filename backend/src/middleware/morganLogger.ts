import morgan from "morgan";
import { RequestLog } from "../models/requestLogmodel.mongodb";
import { Request, Response } from "express";
export const morganMongoLogger = morgan(
  (tokens, req: Request, res: Response) => {
 
    if (res.statusCode >= 400) {
      return null;
    }

    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)),
      responseTime: Number(tokens["response-time"](req, res)),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  },
  {
    stream: {
      write: async (message: string) => {
        try {
          const log = JSON.parse(message);
          await RequestLog.create(log);
        } catch (error) {
          console.error("Failed to save log:", error);
        }
      },
    },
  }
);
