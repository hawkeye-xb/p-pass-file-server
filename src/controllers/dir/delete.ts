import fs from 'fs-extra';
import Joi from "joi";
import { Context } from "../../types/index.ts";
import {
	joiValidate,
	handleErrorMessage,
	handleTryCatchError,
	validate,
	RULES_ERR,
} from '../utils/index.ts';
import trash from 'trash';

const deleteDirValidate = validate<{target: string, force?: boolean}>([
	{
		fn: (params) => {
			return fs.existsSync(params.target);
		},
		err: RULES_ERR.FS_EXIST_SYNC,
	},
	{
		fn: (params) => {
			return fs.statSync(params.target).isDirectory();
		},
		err: RULES_ERR.FS_STAT_SYNC,
	},
	{
		fn: (params) => {
			if (!params?.force) {
				return fs.readdirSync(params.target).length === 0;
			}
			return params?.force;
		},
		err: RULES_ERR.FS_READDIR_SYNC,
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