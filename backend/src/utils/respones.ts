import type { Response } from 'express';

export function sendResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: Record<string, any>
) {
  return res.status(statusCode).json({
    ...data,
    message
  });
}