
import type { Request, Response  } from "express";
import bcrypt from 'bcrypt';
import { AppError } from "../utils/AppError";
import { findUserById } from "../services/auth-service";
import {
  getUserById,
  deleteUser,
  updateUserData,
  findUserByEmail,
  allUsers,
} from "../services/user-service";
import { defultvalues } from "../const/defult-limit";
import { findPostsAndCommentByUserId } from '../services/post-service';
import { ERRORS, errorhandler } from '../const/error-message';
import { sendResponse } from '../utils/respones';
import { User } from '../config/models/sql-models/user-model';
import { env } from "../config/env.config";

const getUserDetailsWithPostandComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = Number(req.params.userId);
    const postLimit = Number(req.query.postLimit) || defultvalues.DEFULT_LIMIT;
    const postOffset = Number(req.query.postOffset) || defultvalues.DEFULT_OFFSET;
    const commentLimit = Number(req.query.commentLimit) || defultvalues.DEFULT_LIMIT;
    const commentOffset = Number(req.query.commentOffset) || defultvalues.DEFULT_OFFSET;

    if (!userId) {
      throw new AppError(ERRORS.message.NOT_FOUND("UserId"), ERRORS.statuscode.NOT_FOUND);
    }

    const user = await getUserById(userId);
    const { password, ...userWithoutPassword } = user.toJSON();
    if (!user) {
      throw new AppError(ERRORS.message.NOT_FOUND("User"), ERRORS.statuscode.NOT_FOUND);
    }

    const posts = await findPostsAndCommentByUserId(userId, postOffset, postLimit, commentLimit, commentOffset);

    return sendResponse(res, 200, "User fetched successfully", {
      userWithoutPassword,
      posts,
    });

  } catch (error) {
    errorhandler(error, "Get User!");
  }
};


const deleteUserAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      throw new AppError(ERRORS.message.UNAUTHORIZED, ERRORS.statuscode.UNAUTHORIZED);
    }

    const userToDelete = await findUserById(authenticatedUser.user_id);

    if (!userToDelete) {
      throw new AppError(ERRORS.message.NOT_FOUND("User"), ERRORS.statuscode.NOT_FOUND);
    }

    if (userToDelete.user_id !== authenticatedUser.user_id) {
      throw new AppError(ERRORS.message.UNAUTHORIZED, ERRORS.statuscode.UNAUTHORIZED);
    }

    const deletionResult = await deleteUser(authenticatedUser.user_id);

    return sendResponse(res, 200, "User deleted successfully!", deletionResult);

  } catch (error) {
    errorhandler(error, "Delete User!");
  }
}

const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticatedUser = req.user;

    const existingUser = await getUserById(authenticatedUser.user_id);

    const { user_name, email, password } = req.body;

    if (email && email !== existingUser.email) {
      const emailAlreadyExists = await findUserByEmail(email);
      if (emailAlreadyExists) {
        throw new AppError(ERRORS.message.CONFLICT("Email"), ERRORS.statuscode.CONFLICT);
      }
    }

    const dataToUpdate: Partial<User> = {};
    if (user_name) dataToUpdate.user_name = user_name;
    if (email) dataToUpdate.email = email;
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, env.JWT.SALT);
    }

    const updatedUser = await updateUserData(existingUser, dataToUpdate);

    const { password: _, ...userWithoutPassword } = updatedUser;
    return sendResponse(res, 200, "User updated successfully!", userWithoutPassword);

  } catch (error) {
    errorhandler(error, "Update User!");
  }
};

const getUser = async (
  req:Request,
  res:Response
):Promise<Response> => {
  try {
    const authenticatedUser = req.user;
    const userData = await getUserById(Number(authenticatedUser.user_id));
    return sendResponse(res, 200, "User Data Fetch SucessFully!", userData);

  } catch (error) {
    errorhandler(error, "Fetch Data!");
  }
}

const allUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const authenticatedAdmin = req.user;

    if (authenticatedAdmin.role !== "Admin") {
      throw new AppError(ERRORS.message.UNAUTHORIZED, ERRORS.statuscode.UNAUTHORIZED);
    }
    const users = await allUsers(offset, limit);
    return sendResponse(res, 200, `Fetched ${users.length} users`, users);
  } catch (error) {
    errorhandler(error, "Fetch Data!")
  }

}
export {
  deleteUserAccount,
  getUserDetailsWithPostandComment,
  updateUserProfile,
  getUser,
  allUser
};