import fs from 'fs-extra';
import Joi from "joi";
import path from "path";
import { Context } from "@/types/index.ts";
import {
	joiValidate,
	handleErrorMessage,
	handleTryCatchError,
	RULES_ERR
} from '../utils/index.ts';
import { checkSync } from 'diskusage';

const preUploadSchema = Joi.object({
	target: Joi.string().required(),
	name: Joi.string().required(),
	size: Joi.number().required(),
});
export const preUpload = (ctx: Context) => {
	try {
		const value = joiValidate(preUploadSchema, ctx);
		if (value === null) {
			return;
		}

		const { target, name, size } = value;
		if (!fs.existsSync(target)) {
			handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC)
			return;
		}

		const targetStat = fs.statSync(target);
		if (!targetStat.isDirectory()) {
			handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC_DIR);
			return;
		}

		// 校验空间是否足够
		const diskUsage = checkSync(target);

		if (diskUsage.available < size) {
			handleErrorMessage(ctx, RULES_ERR.OUT_OF_RANGE);
			return;
		}

		const newPath = path.join(target, name);

		if (fs.existsSync(newPath)) {
			handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
			return;
		}

		ctx.body = {
			code: 0,
			message:'success',
		};
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}
