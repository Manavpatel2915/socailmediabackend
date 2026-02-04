import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

 export const validate =
  (schema: Schema, property: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    req[property] = value;
    next();
  };