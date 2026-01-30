import type { Request, Response } from "express";
import db from '../config/sqldbconnnect';
import { log } from "node:console";


const create_comment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user as any; 
    const { Comment } = req.body;
    const postid = Number(req.params.postId);

    const comment_data = await db.Comment.create({
      Comment,
      post_id: postid,
      user_id: user ? user.user_id : null, 
    });

    return res.status(201).json({
      message: "comment created",
      comment_data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error creating comment",
      error,
    });
  }
};


const update_comment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = req.user as any;
  const comment_id = Number(req.params.commentId);
  const { comment } = req.body;

  if (!comment) {
    return res.status(500).json({
      message: "Comment text is required",
    });
  }

  const existingComment = await db.Comment.findByPk(comment_id);

  if (!existingComment) {
    return res.status(500).json({
      message: "Comment not found",
    });
  }

  if (
    existingComment.id !== user.user_id &&
    user.role !== 'Admin'
  ) {
    return res.status(500).json({
      message: "You are not authorized to update this comment",
    });
  }

  
  await existingComment.update({ comment });

  return res.status(200).json({
    message: "Comment updated successfully",
    data: existingComment,
  });
};
export {
    create_comment,
    update_comment
}