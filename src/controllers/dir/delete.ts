import fs from 'fs-extra';
import Joi from "joi";
import { Context } from "../../types";
import { joiValidate, handleErrorMessage, ERROR_STATUS, ERROR_CODE ,ERROR_MSG, handleTryCatchError } from '../utils';

const deleteDirSchema = Joi.object({
  target: Joi.string().required(),
	force: Joi.boolean(),
});
export const deleteDir = (ctx: Context) => {
	const value = joiValidate(deleteDirSchema, ctx);
	if (value === null) {
		return;
	}

	const { target, force } = value;
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
		// 检查文件夹是否为空
		if (fs.readdirSync(target).length > 0 && !force) {
			handleErrorMessage(ctx, {
				status: ERROR_STATUS.PARAMS_ERROR,
				code: ERROR_CODE.FOLDER_NOT_EMPTY,
				message: ERROR_MSG[ERROR_CODE.FOLDER_NOT_EMPTY],
			})
			return;
		}
		// 删除文件夹
		fs.removeSync(target);
		ctx.body = {
			code: 0,
			message: "success",
			data: null,
		};
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}