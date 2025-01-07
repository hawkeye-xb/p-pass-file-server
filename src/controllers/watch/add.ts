import fs from 'fs-extra';
import Joi from "joi";
import { Context } from "@/types/index.ts";
import { joiValidate, handleErrorMessage, handleTryCatchError, RULES_ERR, handleDirPath } from '../utils/index.ts';
import { addWatch } from "@/services/watcher.ts";

const addWatchSchema = Joi.object({
  target: Joi.string().required(),
});
export const addWatchCtrl = (ctx: Context) => {
	try {
		const value = joiValidate(addWatchSchema, ctx);
		if (value === null) {
			return;
		}
		let { target } = value;
	
		// 判断是否存在
		if (!fs.existsSync(target)) {
			handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
			return;
		}

		// 只对文件夹监听
		if (!fs.statSync(target).isDirectory()) {
			handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC);
			return;
		}

		target = handleDirPath(target);
		const err = addWatch(target); // 上面校验了
		if (err) {
			handleErrorMessage(ctx, {
				...RULES_ERR.WATCHER_ADD_WATCH_EXISTS,
				message: `${RULES_ERR.WATCHER_ADD_WATCH_EXISTS.message} ${err}`,
			});
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
