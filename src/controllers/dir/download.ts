import fs from 'fs-extra';
import Joi from "joi";
import path from "path";
import { Context } from "@/types/index.ts";
import { joiValidate,
	handleErrorMessage,
	handleTryCatchError,
	RULES_ERR
} from '../utils/index.ts';
import archiver from 'archiver';
import { PassThrough } from 'stream';

const downloadSchema = Joi.object({
	target: Joi.string().required(),
});
export const downloadDir = (ctx: Context) => {
	try {
		const value = joiValidate(downloadSchema, ctx);
		if (value === null) {
			return;
		}

		const { target } = value;
		// todo: 需要判断target是否是敏感内容
		
		// 判断是否是目录
		const stat = fs.statSync(target);
		if (!stat.isDirectory()) {
			handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC);
			return;
		}

		ctx.attachment(path.basename(target) + '.zip');
		ctx.set('Content-Type', 'application/zip');

		const archive = archiver('zip', {
			zlib: { level: 9 } // Sets the compression level.
		});

		archive.on('end', () => {
		});

		// 创建一个 PassThrough 流
    const passThroughStream = new PassThrough();
		archive.pipe(passThroughStream);
		archive.on('error', (err: { message: any; }) => {
			passThroughStream.destroy(); // 销毁流并传递错误
		});
		
		archive.directory(target, false);
		// todo：超大型目录，分块添加进压缩流中
		archive.finalize();

		ctx.body = passThroughStream;
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}