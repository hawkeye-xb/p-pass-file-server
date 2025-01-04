import fs from 'fs-extra';
import Joi from "joi";
import { Context } from "@/types/index.ts";
import { joiValidate, handleErrorMessage, handleTryCatchError, RULES_ERR } from '../utils/index.ts';
import { generatePathMetadata, walkDir } from '@/services/utils/handleMetadata.ts';

const getPathMetadataSchema = Joi.object({
	target: Joi.string().required(),
	depth: Joi.number(),
});
export const getPathMetadata = (ctx: Context) => {
	try {
		const value = joiValidate(getPathMetadataSchema, ctx);
		if (value === null) {
			return;
		}

		const { target, depth } = value;
		// 判断是否存在
		if (!fs.existsSync(target)) {
			handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
			return;
		}

		let res = generatePathMetadata(target);
		if (depth) {
			res = walkDir(target, null);
		}

		ctx.body = {
			code: 0,
			message: 'success',
			data: res,
		};
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}