import { AppError  } from "../utils/AppError";
export const ERRORS = {
  MESSAGE: {
    UNAUTHORIZED: "Unauthorized",
    ALL_FIELDS_REQUIRED: "All fields are required",
    SERVER_ERROR: "Internal server error",
    FORBIDDEN: "Forbidden",
    INVALID: (params: string) => `${params} Invalid`,
    NOT_FOUND: (params: string) => `${params} Not Found`,
    CONFLICT: (params: string) => `${params} alredy exists`,
  },
  STATUSCODE: {
    UNAUTHORIZED: 401,
    ALL_FIELDS_REQUIRED: 422,
    FORBIDDEN: 403,
    SERVER_ERROR: 500,
    NOT_FOUND: 404,
    CONFLICT: 409,
  },
};

export function errorhandler(error: unknown, value: string) {
  if (error instanceof AppError) throw error;
  const message = `Failed to ${value}`;
  const statusCode = 500;
  throw new AppError(message, statusCode);
}

