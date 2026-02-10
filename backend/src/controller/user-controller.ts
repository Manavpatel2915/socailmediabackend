import type { Request, Response  } from "express";
import bcrypt from 'bcrypt';
import { AppError } from "../utils/AppError";
import { findUserById } from "../services/auth-service";
import { findUser, deleteUserById, findposts, findecomments, updateUser, useremail } from "../services/user-service";
import { ERRORS, operationFailed, IdNotFound } from '../const/error-message';
import { sendResponse } from '../utils/respones';

const userdetails = async (
        req:Request,
        res:Response
) :Promise<Response> => {
  try {
    const userId = Number(req.params);
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    if (!userId) {
    const error = IdNotFound("UserId");
    throw new AppError(error.message, error.statusCode);
    }
  const user = await findUser(userId);
  const post = await findposts(userId, offset * limit, limit);
  const comment = await findecomments(userId, offset * limit, limit);

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
    console.log(req);

  const user = req.user;
  if (!user) {
   throw new AppError(ERRORS.UNAUTHORIZED.message, ERRORS.UNAUTHORIZED.statusCode);
  }

   const existingUser = await findUserById(user.user_id);
    if (!existingUser) {
   throw new AppError(ERRORS.NOT_FOUND("User"), 404);
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
      throw new AppError(ERRORS.NOT_FOUND("User Not Found!"), 404);
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
        throw new AppError(ERRORS.EXISTS("Email"), 409);
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
         userdetails,
         update,
         };
