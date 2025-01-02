import fs from 'fs-extra';
import Joi from "joi";
import path from "path";
import { Context } from "../../types";
import { joiValidate, handleErrorMessage, ERROR_STATUS, ERROR_CODE ,ERROR_MSG, handleTryCatchError } from '../utils';

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
		// 检查路径是否存在
		if (!fs.existsSync(target)) {
			handleErrorMessage(ctx, {
				status: ERROR_STATUS.PARAMS_ERROR,
				code: ERROR_CODE.FS_NOT_EXIST,
				message: ERROR_MSG[ERROR_CODE.FS_NOT_EXIST],
			})
			return;
		}
		// 检查路径是否为文件夹
		if (!fs.statSync(target).isDirectory()) {
			handleErrorMessage(ctx, {
				status: ERROR_STATUS.PARAMS_ERROR,
				code: ERROR_CODE.NOT_A_DIRECTORY,
				message: ERROR_MSG[ERROR_CODE.NOT_A_DIRECTORY],
			})
			return;
		}

		const newPath = path.join(path.dirname(target), name);

		// 检查新路径是否存在
		if (fs.existsSync(newPath)) {
			handleErrorMessage(ctx, {
				status: ERROR_STATUS.PARAMS_ERROR,
				code: ERROR_CODE.FOLDER_ALREADY_EXISTS,
				message: ERROR_MSG[ERROR_CODE.FOLDER_ALREADY_EXISTS],
			})
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