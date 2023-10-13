import Joi from "joi";

const credentialSchema = Joi.object().keys({
    title: Joi.string().required(),
    url: Joi.string().uri().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
});

export default credentialSchema;