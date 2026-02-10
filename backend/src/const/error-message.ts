import { AppError  } from "../utils/AppError";
export const ERRORS = {

  INVALID_EMAIL: { message: "Invalid email", statusCode: 401 },
  INVALID_PASSWORD: { message: "Invalid password", statusCode: 401 },
  INVALID_CREDENTIALS: { message: "Invalid credentials", statusCode: 401 },
  UNAUTHORIZED: { message: "Unauthorized", statusCode: 401 },

  ALL_FIELDS_REQUIRED: { message: "All fields are required", statusCode: 400 },
  INVALID_INPUT: { message: "Invalid input", statusCode: 400 },

  USER_NOT_FOUND: { message: "User not found", statusCode: 404 },
  POST_NOT_FOUND: { message: "Post not found", statusCode: 404 },
  COMMENT_NOT_FOUND: { message: "Comment not found", statusCode: 404 },

  USER_EXISTS: { message: "User already exists", statusCode: 409 },
  EMAIL_EXISTS: { message: "Email already exists", statusCode: 409 },

  FORBIDDEN: { message: "Forbidden", statusCode: 403 },

  SERVER_ERROR: { message: "Internal server error", statusCode: 500 },
};

export function operationFailed(error: unknown, operation: string): never {
  if (error instanceof AppError) throw error;

  const message = `Failed to ${operation}`;
  const statusCode = 500;
  throw new AppError(message, statusCode);
}


export function IdNotFound(operation: string) {
  return {
    message: `${operation} Not Found!!`,
    statusCode: 500,
  };
}
