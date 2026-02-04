import type { Request, Response } from "express";

import { findCommentById,createComment,updateComment,deletedComment } from "../services/comment-service";
import { AppError } from "../utils/AppError";


const createcomment = async (
  req: Request,
  res: Response
): Promise<Response> => {
    const user = req.user; 
    const {Comment} = req.body;
  
    const postId = Number(req.params.postId);
    const userId = user ? user.user_id : null;
    
    const commentData = await createComment(postId,userId,Comment);

    return res.status(201).json({
      message: "comment created",
      commentData,
    });
  
};

const updatecomment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = req.user;
  if (!user) {
  
    throw new AppError("Unauthorized", 401);

  }
  const commentId = Number(req.params.commentId);
  const { Comment } = req.body;

  if (!Comment) {
    throw new AppError("Comment text is required", 500);
  }
  const existingComment = await findCommentById(commentId);
  if (!existingComment) {
    throw new AppError("Comment not found", 500);
    
  }
  if (
    existingComment.user_id !== user.user_id &&
    user.role !== 'Admin'
  ) {
    throw new AppError("You are not authorized to update this comment",500);
  }

  
  await updateComment(existingComment,Comment);

  return res.status(200).json({
    message: "Comment updated successfully"
  });
};

const deletecomment = async(
  req:Request,
  res:Response
    
):Promise<Response>=>{
 
  
  const user = req.user;
  if (!user) {
    throw new AppError("unathorized",401);
  }
  const commentId = Number(req.params.id);
   const comment = await findCommentById(commentId);

     if(!comment) {
    throw new AppError("comment not found",404);
  }
   if(comment.user_id !== user.user_id && user.role !=="Admin" ){
    throw new AppError("you have not Authorized to delete this post",401);
  }

    await deletedComment(commentId);
  
    return res.status(200).json({
      message : "your commented deleted scuessfully !"
    })
  
}

export {
    createcomment,
    updatecomment,
    deletecomment,

}