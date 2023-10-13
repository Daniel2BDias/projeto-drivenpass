import Joi from "joi";

const signUpSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(10).required()
});

const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export { signUpSchema, loginSchema };