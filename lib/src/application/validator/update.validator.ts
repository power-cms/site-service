import * as Joi from 'joi';

export const validator = Joi.object().keys({
  title: Joi.string()
    .trim()
    .required(),
  content: Joi.string()
    .trim()
    .required(),
  url: Joi.string()
    .trim()
    .uri({ relativeOnly: true })
    .required(),
});
