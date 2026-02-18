import { Schema, model, models, type Document, type Model } from "mongoose";

export interface IRequestLog extends Document {
  method?: string;
  url?: string;
  status: number;
  responseTime?: number;
  ip?: string;
  userAgent?: string;
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
  },
  { timestamps: true }
);

export const RequestLog: Model<IRequestLog> =
  (models.RequestLog as Model<IRequestLog>) ||
  model<IRequestLog>("RequestLog", requestLogSchema);