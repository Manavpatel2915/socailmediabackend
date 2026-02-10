import { Schema, model, models, type Document, type Model } from "mongoose";

export interface ErrorLog extends Document {
  method?: string;
  url?: string;
  status: number;
  responseTime?: number;
  ip?: string;
  userAgent?: string;
  errorMessage?: string;
  errorStack?: string;
  errorType?: string;
  createdAt: Date;
}

const ErrorLogSchema = new Schema<ErrorLog>(
  {
    method: String,
    url: String,
    status: { type: Number, required: true },
    responseTime: Number,
    ip: String,
    userAgent: String,
    errorMessage: String,
    errorStack: String,
    errorType: String
  },
  { timestamps: true }
);


export const ErrorLog: Model<ErrorLog> =
  (models.ErrorLog as Model<ErrorLog>) ||
  model<ErrorLog>("ErrorLog", ErrorLogSchema);