import type { Request, Response  } from "express";

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
import redis from "../config/databases/redis";
import { userDetailsQueues } from "../queues/userdetailsQueues";
import { notificationget } from "../services/notification-service";

const getUserDetailsWithPostandComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = Number(req.params.userId);
    const postLimit = Number(req.query.postLimit) || defultvalues.DEFULT_LIMIT;
    const postOffset = Number(req.query.postOffset) || defultvalues.DEFULT_OFFSET;
    const comment = req.query.comment_required === 'false';
    const cacheKey = req.rediskey;
    if (!userId) {
      throw new AppError(ERRORS.MESSAGE.notFound("UserId"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const user = await getUserById(userId);
    if (!user) {
      throw new AppError(ERRORS.MESSAGE.notFound("User"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    const posts = await findPostsAndCommentByUserId(userId, postOffset, postLimit, comment);
    await redis.set(cacheKey, JSON.stringify({ user, posts }), "EX", Number(env.RATELIMIT.REAT_TIMER));
    return sendResponse(res, 200, "User fetched successfully", {
      user,
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
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
    }

    const userToDelete = await findUserById(authenticatedUser.user_id);

    if (!userToDelete) {
      throw new AppError(ERRORS.MESSAGE.notFound("User"), ERRORS.STATUSCODE.NOT_FOUND);
    }

    if (userToDelete.user_id !== authenticatedUser.user_id) {
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
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
        throw new AppError(ERRORS.MESSAGE.conflict("Email"), ERRORS.STATUSCODE.CONFLICT);
      }
    }

    const dataToUpdate: Partial<User> = {};
    if (user_name) dataToUpdate.user_name = user_name;
    if (email) dataToUpdate.email = email;
    if (password) {
      dataToUpdate.password = password;
    }
    const updatedUser = await updateUserData(existingUser, dataToUpdate);
    return sendResponse(res, 200, "User updated successfully!", updatedUser);

  } catch (error) {
    errorhandler(error, "Update User!");
  }
};

const getUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const authenticatedUser = req.user;
    const cacheKey = req.rediskey;
    const userData = await getUserById(
      Number(authenticatedUser.user_id)
    );
    await redis.set(cacheKey, JSON.stringify(userData), "EX", env.RATELIMIT.REAT_TIMER);

    return sendResponse(
      res,
      200,
      "User Data Fetched Successfully!",
      userData
    );
  } catch (error) {
    errorhandler(error, "Fetch Data!");
  }
};

const allUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const rediskey = req.rediskey;
    const authenticatedAdmin = req.user;

    if (authenticatedAdmin.role !== "Admin") {
      throw new AppError(ERRORS.MESSAGE.UNAUTHORIZED, ERRORS.STATUSCODE.UNAUTHORIZED);
    }
    const users = await allUsers(offset, limit);
    await redis.set(rediskey, JSON.stringify(users), "EX", env.RATELIMIT.REAT_TIMER)
    return sendResponse(res, 200, `Fetched ${users.length} users`, users);
  } catch (error) {
    errorhandler(error, "Fetch Data!")
  }

}

const userAllData = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authenticate = req.user;
    const userId = Number(authenticate.user_id);
    await userDetailsQueues.add('userDetails', { user_id: userId });
    return sendResponse(res, 200, `user data downloaded successfully`);

  } catch (error) {
    errorhandler(error, "DownloadData!");
  }
};

const getNotfication = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const authenticate = req.user;
    const user_id = authenticate.user_id;
    const data = await  notificationget(user_id);
    return sendResponse(res, 200, "allNotification", data);
  } catch (error) {
    errorhandler(error, "Fetch notification");
  }
}

export {
  deleteUserAccount,
  getUserDetailsWithPostandComment,
  updateUserProfile,
  getUser,
  allUser,
  userAllData,
  getNotfication
};