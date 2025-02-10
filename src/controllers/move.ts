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

    // 标准化路径
    const { src, dest } = value;
    const normalizedDest = path.normalize(dest);

    if (!fs.existsSync(normalizedDest)) {
      handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
      return;
    }
    if (!fs.statSync(normalizedDest).isDirectory()) {
      handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC);
      return;
    }

    for (const target of src) {
      const normalizedTarget = path.normalize(target);
      if (!fs.existsSync(normalizedTarget)) {
        handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
        return;
      }

      const targetDestPath = path.join(normalizedDest, path.basename(normalizedTarget));
      if (fs.existsSync(targetDestPath)) {
        handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
        return;
      }
    }

    for (const target of src) {
      const normalizedTarget = path.normalize(target);
      const targetDestPath = path.join(normalizedDest, path.basename(normalizedTarget));
      fs.moveSync(normalizedTarget, targetDestPath);

      // 检查源文件是否已删除
      if (fs.existsSync(normalizedTarget)) {
        handleErrorMessage(ctx, {
          ...RULES_ERR.FS_REMOVE_SYNC,
          message: `Failed to remove source file: ${normalizedTarget}`,
        });
        return;
      }
    }
    ctx.body = {
      code: 0,
      message: 'success',
    };
  } catch (error) {
    handleTryCatchError(ctx, error);
  }
}