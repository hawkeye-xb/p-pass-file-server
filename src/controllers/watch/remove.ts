import fs from 'fs-extra';
import Joi from "joi";
import { Context } from "@/types/index.ts";
import { joiValidate, handleErrorMessage, handleTryCatchError, RULES_ERR } from '../utils/index.ts';
import { unWatch } from "@/services/watcher.ts";

const unWatchSchema = Joi.object({
  target: Joi.string().required(),
});
export const unWatchCtrl = (ctx: Context) => {
	try {
		const value = joiValidate(unWatchSchema, ctx);
		if (value === null) {
			return;
		}
		const { target } = value;

		// 只对文件夹监听
		if (!fs.statSync(target).isDirectory()) {
			handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC);
			return;
		}

		const res = unWatch(target); // 上面校验了
		if (!res) {
			handleErrorMessage(ctx, RULES_ERR.WATCHER_UNWATCH_NOT_WATCH);
			return;
		}
		ctx.body = {
			code: 0,
			message: 'success',
		};
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
};
