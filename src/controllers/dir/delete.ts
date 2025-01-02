import fs from 'fs-extra';
import Joi from "joi";
import { Context } from "../../types/index.ts";
import { joiValidate, handleErrorMessage, ERROR_STATUS, ERROR_CODE ,ERROR_MSG, handleTryCatchError } from '../utils/index.ts';
import trash from 'trash';

const validate = <T>(rules: {
	fn: (params: T) => Boolean,
	err: {
		status: ERROR_STATUS,
		code: ERROR_CODE,
		message: string,
	}
}[]) => {
	return (params: T) => {
		for (const rule of rules) {
		if (!rule.fn(params)) {
			return rule.err;
		}
	}

	return null;
	}
}

const deleteDirValidate = validate<{target: string, force?: boolean}>([
	{
		fn: (params) => {
			return fs.existsSync(params.target);
		},
		err: {
			status: ERROR_STATUS.PARAMS_ERROR,
			code: ERROR_CODE.FS_NOT_EXIST,
			message: ERROR_MSG[ERROR_CODE.FS_NOT_EXIST],
		}
	},
	{
		fn: (params) => {
			return fs.statSync(params.target).isDirectory();
		},
		err: {
			status: ERROR_STATUS.PARAMS_ERROR,
			code: ERROR_CODE.NOT_A_DIRECTORY,
			message: ERROR_MSG[ERROR_CODE.NOT_A_DIRECTORY],
		}
	},
	{
		fn: (params) => {
			if (!params?.force) {
				return fs.readdirSync(params.target).length === 0;
			}
			return params?.force;
		},
		err: {
			status: ERROR_STATUS.PARAMS_ERROR,
			code: ERROR_CODE.FOLDER_NOT_EMPTY,
			message: ERROR_MSG[ERROR_CODE.FOLDER_NOT_EMPTY],
		}
	},
]);

const deleteOption = (b: boolean) => {
	if (b) {
		return trash;
	}
	return fs.removeSync;
}

// 批量删除
const deleteDirsSchema = Joi.object({
  targets: Joi.array().items(Joi.string()).required(),
	force: Joi.boolean(),
	// 是否移动到回收站，或直接删除
	trash: Joi.boolean(),
});
export const deleteDirs = (ctx: Context) => {
	try {
		const value = joiValidate(deleteDirsSchema, ctx);
		if (value === null) {
			return;
		}

		const { targets, force = false, trash = true } = value;
		// 校验所有target

		for (const target of targets) {
			const err = deleteDirValidate({ target, force });
			if (err) {
				handleErrorMessage(ctx, {
					...err,
					message: `${target} ${err.message}`,
				});
				return;
			}
		}

		const del = deleteOption(trash);
		for (const target of targets) {
			// 移动到系统的垃圾桶
			del(target);
		}
		ctx.body = {
			code: 0,
			message: "success",
			data: null,
		};
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}