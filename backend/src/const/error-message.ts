import { AppError  } from "../utils/AppError";
export const ERRORS = {
  INVALID: (params: string) => `${params} Invalid`,
  UNAUTHORIZED: { message: "Unauthorized", statusCode: 401 },

  ALL_FIELDS_REQUIRED: { message: "All fields are required", statusCode: 400 },

  NOT_FOUND: (params: string) => `${params} Not Found`,
  EXISTS: (params: string) => `${params} alredy exists`,


  FORBIDDEN: { message: "Forbidden", statusCode: 403 },

  SERVER_ERROR: { message: "Internal server error", statusCode: 500 },
};

export function operationFailed(error: unknown, value: string) {
  if (error instanceof AppError) throw error;

  const message = `Failed to ${value}`;
  const statusCode = 500;
  throw new AppError(message, statusCode);
}


export function IdNotFound(value: string) {
  return {
    message: `${value} Not Found!!`,
    statusCode: 500,
  };
}
