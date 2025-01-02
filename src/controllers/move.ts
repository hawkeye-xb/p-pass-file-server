import fs from 'fs-extra';
import Joi from "joi";
import path from "path";
import { Context } from "../types/index.ts";
import { joiValidate, handleErrorMessage, handleTryCatchError, RULES_ERR } from './utils/index.ts';

const moveSrcSchema = Joi.object({
  src: Joi.array().items(Joi.string()).required(),
  dest: Joi.string().required(),
});
export const moveSrc = (ctx: Context) => {
  try {
    const value = joiValidate(moveSrcSchema, ctx);
    if (value === null) {
      return;
    }

    const { src, dest } = value;
    if (!fs.existsSync(dest)) {
      handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
      return;
    }
    if (!fs.statSync(dest).isDirectory()) {
      handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC);
      return;
    }

    for (const target of src) {
      if (!fs.existsSync(target)) {
        handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
        return;
      }

      const targetDestPath = path.join(dest, path.basename(target));
      if (fs.existsSync(targetDestPath)) {
        handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
        return;
      }
    }

    for (const target of src) {
      const targetDestPath = path.join(dest, path.basename(target));
      fs.moveSync(target, targetDestPath);
    }
    ctx.body = {
      code: 0,
      message: 'success',
    };
  } catch (error) {
		handleTryCatchError(ctx, error);
  }
}