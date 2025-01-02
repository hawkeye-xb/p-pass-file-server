import fs from 'fs-extra';
import Joi from "joi";
import path from "path";
import { Context } from "../../types/index.ts";
import { joiValidate,
	handleErrorMessage,
	handleTryCatchError,
	RULES_ERR,
} from '../utils/index.ts';

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
			handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
			return;
		}

		if (!fs.statSync(target).isDirectory()) {
			handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC);
			return;
		}

		if (fs.existsSync(path.join(target, name))) {
			handleErrorMessage(ctx, RULES_ERR.FS_EXISTS_SYNC);
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