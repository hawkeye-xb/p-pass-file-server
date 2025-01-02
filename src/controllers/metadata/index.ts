import fs from 'fs-extra';
import Joi from "joi";
import { Context } from "@/types/index.ts";
import { joiValidate, handleErrorMessage, handleTryCatchError, RULES_ERR } from '../utils/index.ts';

const getPathMetadataSchema = Joi.object({
	target: Joi.string().required(),
});
export const getPathMetadata = (ctx: Context) => {
	try {
		const value = joiValidate(getPathMetadataSchema, ctx);
		if (value === null) {
			return;
		}

		const { target } = value;
		// 判断是否存在
		if (!fs.existsSync(target)) {
			handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
			return;
		}
		const stats = fs.statSync(target);
		ctx.body = {
			code: 0,
			message: 'success',
			data: stats,
		};
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}