import fs from 'fs-extra';
import Joi from "joi";
import path from "path";
import { Context } from "../../types/index.ts";
import { joiValidate, handleErrorMessage, ERROR_STATUS, ERROR_CODE ,ERROR_MSG, handleTryCatchError } from '../utils/index.ts';

const moveDirSchema = Joi.object({
  src: Joi.string().required(),
  dest: Joi.string().required(),
});
export const moveDir = (ctx: Context) => {}