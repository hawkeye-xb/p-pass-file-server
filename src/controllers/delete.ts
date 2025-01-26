import fs from 'fs-extra';
import Joi from "joi";
import { Context } from "@/types/index.ts";
import {
	joiValidate,
	handleErrorMessage,
	handleTryCatchError,
	RULES_ERR,
} from './utils/index.ts';
import trash from 'trash';

const deleteOption = (b: boolean) => {
	if (b) {
		return trash;
	}
	return fs.remove;
}
const deleteSrcScheme = Joi.object({
	targets: Joi.array().items(Joi.string()).required(),
	force: Joi.boolean(),
	trash: Joi.boolean(),
});
export const deleteSrc = (ctx: Context) => {
	try {
		const value = joiValidate(deleteSrcScheme, ctx);
		if (value === null) {
			return;
		}

		const { targets, force = false, trash = true } = value;

		for (const target of targets) {
			// 是否存在
			if (!fs.existsSync(target)) {
				handleErrorMessage(ctx, {
					...RULES_ERR.FS_EXIST_SYNC,
					message: `${target} ${RULES_ERR.FS_EXIST_SYNC.message}`,
				});
				return;
			}

			const isDir = fs.statSync(target).isDirectory();
			const isFile = fs.statSync(target).isFile();
			if (!isDir && !isFile) {
				handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC);
				return;
			}
			if (isDir && !force && fs.readdirSync(target).length !== 0) {
				handleErrorMessage(ctx, {
					...RULES_ERR.FS_READDIR_SYNC,
					message: `${target} ${RULES_ERR.FS_READDIR_SYNC.message}`,
				});
				return;
			}
		}

		const del = deleteOption(trash);
		const delErr: any[] = [];
		const handle = async () => {
			for (const target of targets) {
				try {
					await del(target);
				} catch (error) {
					delErr.push({
						target,
						error
					});
				}
			}
		}
		handle();

		ctx.body = {
			code: 0,
			message: 'success',
			data: delErr,
		};
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}
