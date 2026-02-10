import type { Request, Response  } from "express";
import bcrypt from 'bcrypt';
import { AppError } from "../utils/AppError";
import { findUserById } from "../services/auth-service";
import { findUser, deleteUserById, PostData, CommentData, updateUser, useremail } from "../services/user-service";
import { ERRORS, operationFailed, IdNotFound } from '../const/error-message';
import { sendResponse } from '../utils/respones';

const getuser = async (
        req:Request,
        res:Response
) :Promise<Response> => {
  try {
    const userId = Number(req.params);
    if (!userId) {
     const error = IdNotFound("UserId");
           throw new AppError(error.message, error.statusCode);
    }

  const user = await findUser(userId);
  const post = await PostData(userId);
  const comment = await CommentData(userId);

  return sendResponse(res, 200, "User fetched successfully", {
      user,
      post,
      comment
    });

  } catch (error){
    operationFailed(error, "Get User!");
}

}

const deleteuser = async (
  req:Request,
  res:Response
):Promise<Response> => {
  try {


  const user = req.user;
  if (!user) {
   throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
  }

   const existingUser = await findUserById(user.user_id);
    if (!existingUser) {
   throw new AppError(ERRORS.USER_NOT_FOUND.message, ERRORS.USER_NOT_FOUND.statusCode);
  }
  if (existingUser.user_id !== user.user_id){
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
  }

      const result = await deleteUserById(user.user_id);

      return sendResponse(res, 201, "Delete user sucessfully!", result);
} catch (error){
    operationFailed(error, "Delete User!");
}
}

const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user;

    console.log(req.params);
    const userId = Number(req.params.id);

    if (!userId || isNaN(userId)) {
      const error = IdNotFound("UserId");
      throw new AppError(error.message, error.statusCode);
    }

    const existingUser = await findUser(userId);


    if (!existingUser) {
      const error = ERRORS.USER_NOT_FOUND;
      throw new AppError(error.message, error.statusCode);
    }


    if (existingUser.user_id !== user.user_id && user.role !== "Admin") {
      const error = ERRORS.UNAUTHORIZED;
      throw new AppError(error.message, error.statusCode);
    }

    const { user_name, email, password } = req.body;

    if (!user_name && !email && !password) {
      const error = ERRORS.ALL_FIELDS_REQUIRED;
      throw new AppError(error.message, error.statusCode);
    }

    if (email && email !== existingUser.email) {
      const emailExists = await useremail(email);
      if (emailExists) {
        const error = ERRORS.EMAIL_EXISTS;
        throw new AppError(error.message, error.statusCode);
      }
    }

    const updateData: any = {};
    if (user_name) updateData.user_name = user_name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await updateUser(existingUser, updateData);


    const { password: _, ...userWithoutPassword } = updatedUser.toJSON();
    return sendResponse(res, 200, "User Updated Sucessfully!", userWithoutPassword);

  } catch (error){
    operationFailed(error, "Update User!");
}
};


export { deleteuser,
         getuser,
         update,
         };
