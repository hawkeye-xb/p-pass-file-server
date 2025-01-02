import Joi from "joi";
import { Context } from "@/types/index.ts";
import { ERROR_STATUS, ERROR_CODE, ERROR_MSG, handleErrorMessage } from './error.ts';

export const joiValidate = (scheme: Joi.ObjectSchema<any>, ctx: Context) => {
	const { error, value } = scheme.validate(ctx.request.body);

	if (error) {
		handleErrorMessage(ctx, {
			status: ERROR_STATUS.PARAMS_ERROR,
			code: ERROR_CODE.PARAMS_VALIDATE_ERROR,
			message: error.details[0].message
		});
		return null;
	}

	return value;
}

interface RULES_ERR_TYPE {
	status: ERROR_STATUS,
	code: ERROR_CODE,
	message: string,
}
// business validate
export const validate = <T>(rules: {
	fn: (params: T) => Boolean,
	err: RULES_ERR_TYPE
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

export const RULES_ERR: Record<string, RULES_ERR_TYPE> = {
	FS_EXIST_SYNC: {
		status: ERROR_STATUS.PARAMS_ERROR,
		code: ERROR_CODE.FS_NOT_EXIST,
		message: ERROR_MSG[ERROR_CODE.FS_NOT_EXIST],
	},
	FS_STAT_SYNC: {
		status: ERROR_STATUS.PARAMS_ERROR,
		code: ERROR_CODE.NOT_A_DIRECTORY,
		message: ERROR_MSG[ERROR_CODE.NOT_A_DIRECTORY],
	},
	FS_STAT_SYNC_FILE: {
		status: ERROR_STATUS.PARAMS_ERROR,
		code: ERROR_CODE.NOT_A_FILE,
		message: ERROR_MSG[ERROR_CODE.NOT_A_FILE],
	},
	FS_READDIR_SYNC: {
		status: ERROR_STATUS.PARAMS_ERROR,
		code: ERROR_CODE.FOLDER_NOT_EMPTY,
		message: ERROR_MSG[ERROR_CODE.FOLDER_NOT_EMPTY],
	},
	FS_EXISTS_SYNC: {
		status: ERROR_STATUS.PARAMS_ERROR,
		code: ERROR_CODE.FOLDER_ALREADY_EXISTS,
		message: ERROR_MSG[ERROR_CODE.FOLDER_ALREADY_EXISTS],
	},
};
