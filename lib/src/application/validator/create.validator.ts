import * as Joi from 'joi';
import { SiteType } from '../../domain/site.type';

export const validator = Joi.object().keys({
  type: Joi.string()
    .trim()
    .required()
    .valid([SiteType.Blog, SiteType.Text]),
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
