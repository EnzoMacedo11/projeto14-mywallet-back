import joi from "joi";

const valueschema = joi.object({
  operation: joi.string().min(1).required(),
  value: joi.number().min(1).required()
});

export default valueschema;