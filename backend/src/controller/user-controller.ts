// user-controller.ts
import type { Request, Response  } from "express";
import bcrypt from 'bcrypt';
import { AppError } from "../utils/AppError";
import { findUserById } from "../services/auth-service";
import {
  getUserById,
  deleteUser,
  getUserPosts,
  getUserComments,
  updateUserData,
  findUserByEmail
} from "../services/user-service";
import { ERRORS, operationFailed, IdNotFound } from '../const/error-message';
import { sendResponse } from '../utils/respones';

const getUserDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = Number(req.params.id);
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    if (!userId || isNaN(userId)) {
      const error = IdNotFound("UserId");
      throw new AppError(error.message, error.statusCode);
    }

    const user = await getUserById(userId);
    if (!user) {
      throw new AppError(ERRORS.NOT_FOUND("User"), 404);
    }

    const posts = await getUserPosts(userId, offset * limit, limit);
    const comments = await getUserComments(userId, offset * limit, limit);

    return sendResponse(res, 200, "User fetched successfully", {
      user,
      posts,
      comments
    });

  } catch (error) {
    operationFailed(error, "Get User!");
  }
}

const deleteUserAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
    }

    const userToDelete = await findUserById(authenticatedUser.user_id);

    if (!userToDelete) {
      throw new AppError(ERRORS.NOT_FOUND("User"), 404);
    }

    if (userToDelete.user_id !== authenticatedUser.user_id) {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    const deletionResult = await deleteUser(authenticatedUser.user_id);

    return sendResponse(res, 200, "User deleted successfully!", deletionResult);

  } catch (error) {
    operationFailed(error, "Delete User!");
  }
}

const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;
    const userIdToUpdate = Number(req.params.id);

    if (!userIdToUpdate) {
      const error = IdNotFound("UserId");
      throw new AppError(error.message, error.statusCode);
    }

    const existingUser = await getUserById(userIdToUpdate);

    if (!existingUser) {
      throw new AppError(ERRORS.NOT_FOUND("User"), 404);
    }

    if (existingUser.user_id !== authenticatedUser.user_id && authenticatedUser.role !== "Admin") {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    const { user_name, email, password } = req.body;

    if (!user_name && !email && !password) {
      const error = ERRORS.ALL_FIELDS_REQUIRED;
      throw new AppError(error.message, error.statusCode);
    }


    if (email && email !== existingUser.email) {
      const emailAlreadyExists = await findUserByEmail(email);
      if (emailAlreadyExists) {
        throw new AppError(ERRORS.EXISTS("Email"), 409);
      }
    }

    const dataToUpdate: any = {};
    if (user_name) dataToUpdate.user_name = user_name;
    if (email) dataToUpdate.email = email;
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await updateUserData(existingUser, dataToUpdate);

    const { password: _, ...userWithoutPassword } = updatedUser.toJSON();
    return sendResponse(res, 200, "User updated successfully!", userWithoutPassword);

  } catch (error) {
    operationFailed(error, "Update User!");
  }
};

export {
  deleteUserAccount,
  getUserDetails,
  updateUserProfile,
};