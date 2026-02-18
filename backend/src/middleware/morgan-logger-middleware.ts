import morgan from "morgan";
import { RequestLog } from "../config/models/mongodb-Models/request-log";
import { Request, Response } from "express";
import { env } from "../config/env.config";
import path from 'path';
import fs from 'fs';
import fsPromises from "fs/promises";
import { mounth } from "../const/mounth";
const LOG_PLACE = env.LOG.LOG_PLACE;

export const morganMongoLogger = morgan(
  (tokens, req: Request, res: Response) => {

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
        if (LOG_PLACE) {
          try {
            const year = new Date().getFullYear().toString();
            const month = mounth[(new Date().getMonth() + 1)];
            const dirname = path.resolve("src", "log", year, month);
            fs.mkdirSync(dirname, { recursive: true });
            await fsPromises.appendFile(path.join(dirname, "request-log.txt"), message + "\n", 'utf8');
          } catch (error) {
            console.error("Failed to save log into FILEMODULE", error);
          }
        } else {
          try {
            const log = JSON.parse(message);
            await RequestLog.create(log);
          } catch (error) {
            console.error("Failed to save log:", error);
          }
        }
      }
    },
  }
);
