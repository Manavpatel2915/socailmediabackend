import Joi from "joi";


export const createUserSchema = Joi.object({
  user_name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  role: Joi.string(),
  user_id: Joi.forbidden(),
});

