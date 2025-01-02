import fs from 'fs-extra';
import Joi from "joi";
import path from "path";
import { Context } from "../../types";
import { joiValidate, handleErrorMessage, ERROR_STATUS, ERROR_CODE ,ERROR_MSG, handleTryCatchError } from '../utils';

const createDirSchema = Joi.object({
  target: Joi.string().required(),
  name: Joi.string().required(),
});
export const createDir = (ctx: Context) => {
	const value = joiValidate(createDirSchema, ctx);
	if (value === null) {
		return;
	}

	const { target, name } = value;
	try {
		if (!fs.existsSync(target)) {
			handleErrorMessage(ctx, {
				status: ERROR_STATUS.PARAMS_ERROR,
				code: ERROR_CODE.FS_NOT_EXIST,
				message: ERROR_MSG[ERROR_CODE.FS_NOT_EXIST],
			})
			return;
		}

		if (fs.existsSync(path.join(target, name))) {
			handleErrorMessage(ctx, {
				status: ERROR_STATUS.PARAMS_ERROR,
				code: ERROR_CODE.FOLDER_ALREADY_EXISTS,
				message: ERROR_MSG[ERROR_CODE.FOLDER_ALREADY_EXISTS],
			})
			return;
		}

		fs.mkdirSync(path.join(target, name));
		ctx.body = {
			code: 0,
			message: 'success',
		}
	} catch (error: any) {
		handleTryCatchError(ctx, error);
	}
}