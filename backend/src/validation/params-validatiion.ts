import Joi from 'joi';
import { defultvalues } from "../const/defult-limit";
export const userParamsSchema = Joi.object({
  userId: Joi.number()
    .integer()
    .positive()
    .required()
})

export const userPostCommentQuerySchema = Joi.object({
  postLimit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(defultvalues.DEFULT_LIMIT),
  postOffset: Joi.number()
    .integer()
    .min(0)
    .default(defultvalues.DEFULT_OFFSET),
  commentLimit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(defultvalues.DEFULT_LIMIT),
  commentOffset: Joi.number()
    .integer()
    .min(0)
    .default(defultvalues.DEFULT_OFFSET)
});

export const postParamsSchema = Joi.object({
  postId: Joi.number()
    .integer()
    .positive()
    .required()
})

export const commentParamsSchema = Joi.object({
  commentId: Joi.number()
    .integer()
    .positive()
    .required()
})