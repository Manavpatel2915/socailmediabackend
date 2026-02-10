import Joi from "joi";

export const createPostSchema = Joi.object({

    post_id: Joi.forbidden(),
    title: Joi.string().max(255).optional(),
    content: Joi.string().min(1).required(),
    image: Joi.string().uri().optional(),
    like: Joi.forbidden(),

});
export const updatePostSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  content: Joi.string().min(1).optional(),
  image: Joi.string().uri().optional(),
  post_id: Joi.forbidden(),
  like: Joi.forbidden(),
});



