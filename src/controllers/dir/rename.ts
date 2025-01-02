import fs from 'fs-extra';
import Joi from "joi";
import path from "path";
import { Context } from "../../types/index.ts";
import { joiValidate, handleErrorMessage, handleTryCatchError, RULES_ERR } from '../utils/index.ts';

const renameDirSchema = Joi.object({
  target: Joi.string().required(),
  name: Joi.string().required(),
});
export const renameDir = (ctx: Context) => {
	const value = joiValidate(renameDirSchema, ctx);
	if (value === null) {
		return;
	}

	const { target, name } = value;

	try {
		if (!fs.existsSync(target)) {
			handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC)
			return;
		}
		if (!fs.statSync(target).isDirectory()) {
			handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC);
			return;
		}

		const newPath = path.join(path.dirname(target), name);

		if (fs.existsSync(newPath)) {
			handleErrorMessage(ctx, RULES_ERR.FS_EXISTS_SYNC);
			return;
		}
		// 重命名文件夹
		fs.renameSync(target, newPath);
		ctx.body = {
			code: 0,
			message:'success',
		}
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}