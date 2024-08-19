import * as Joi from 'joi';

export const JoivValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  DB_NAME: Joi.required(),
  PORT: Joi.number().default(3005),
});
