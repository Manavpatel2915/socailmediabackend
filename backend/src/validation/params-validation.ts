import Joi from "joi";
import { defaultValues } from "../const/const-value";

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
    .default(defaultValues.DEFAULT_LIMIT),
  postOffset: Joi.number()
    .integer()
    .min(0)
    .default(defaultValues.DEFAULT_OFFSET),
  commentLimit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(defaultValues.DEFAULT_LIMIT),
  commentOffset: Joi.number()
    .integer()
    .min(0)
    .default(defaultValues.DEFAULT_OFFSET)
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