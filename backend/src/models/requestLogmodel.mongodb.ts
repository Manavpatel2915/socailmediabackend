import { Schema, model, models, type Document, type Model } from "mongoose";

export interface IRequestLog extends Document {
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

const requestLogSchema = new Schema<IRequestLog>(
  {
    method: String,
    url: String,
    status: { type: Number, required: true },
    responseTime: Number,
    ip: String,
    userAgent: String,

    errorMessage: String,
    errorStack: String,
    errorType: String,
  },
  { timestamps: true }
);

// Prevent OverwriteModelError in dev/hot reload
export const RequestLog: Model<IRequestLog> =
  (models.RequestLog as Model<IRequestLog>) ||
  model<IRequestLog>("RequestLog", requestLogSchema);