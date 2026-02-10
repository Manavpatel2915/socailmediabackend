import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { AppError } from "../utils/AppError";

 export const validate =
  (schema: Schema, property: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      const message = details.join(', ');
      throw new AppError(message, 400);
    }

    req[property] = value;
    next();
  };