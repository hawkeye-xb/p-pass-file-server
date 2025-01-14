import fs from 'fs-extra';
import Joi from "joi";
import path from "path";
import { Context } from "@/types/index.ts";
import { joiValidate,
	handleErrorMessage,
	handleTryCatchError,
	RULES_ERR
} from '../utils/index.ts';

const downloadSchema = Joi.object({
	target: Joi.string().required(),
	offset: Joi.number(),
	size: Joi.number(),
});
export const downloadFile = (ctx: Context) => {
	try {
		const value = joiValidate(downloadSchema, ctx);
		if (value === null) {
			return;
		}

		const { target, offset = undefined, size = undefined } = value;

		// todo: 需要判断target是否是敏感内容
		// 与目录下载区分开？目录下载压缩包，如果需要一比一下载，从前端处理

		// 判断是否是文件
		const stat = fs.statSync(target);
		if (!stat.isFile()) {
			handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC_FILE);
			return;
		}

		const options: any = {}; // todo: any
		
		if (offset !== undefined && 0 < offset) {
			options['start'] = Math.min(offset, stat.size);
		}

		ctx.set('Content-Length', stat.size.toString());
		if (size !== undefined && 0 < size) {
			if (offset !== undefined && 0 < offset) {
				options['end'] = Math.min(offset + size -1, stat.size);

				ctx.set('Content-Length', (options['end'] - options['start']).toString());
			} else {
				options['end'] = Math.min(size -1, stat.size); // 需要-1吗？

				ctx.set('Content-Length', options['end'].toString());
			}
		}

		const fileStream = fs.createReadStream(target, options);
		fileStream.on('error', (err) => {
			console.log(err); // todo
		});

		ctx.set('Content-Type', 'application/octet-stream');
		ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(path.basename(target))}`);

		ctx.body = fileStream;
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}