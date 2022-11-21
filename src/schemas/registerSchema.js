import joi from "joi";

const registerschema = joi.object({
  name: joi.string().min(1).required(),
  email: joi.string().email().required(),
  password: joi.string().min(1).required(),
  passwordConfirmation: joi.ref("password"),
});

export default registerschema;