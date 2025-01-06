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

const aggregateFilesSchema = Joi.object({
	target: Joi.string().required(),
	filePaths: Joi.array().items(Joi.object({
		index: Joi.number().required(),
		path: Joi.string().required(),
	})).required(),
	name: Joi.string().required(),
});
export const aggregateFiles = async (ctx: Context) => {
	try {
		const value = joiValidate(aggregateFilesSchema, ctx);
		if (value === null) {
			return;
		}

		const { target, filePaths, name } = value;
		
		if (!fs.existsSync(target)) {
			handleErrorMessage(ctx, RULES_ERR.FS_EXIST_SYNC);
			return;
		}

		if (!fs.statSync(target).isDirectory()) {
			handleErrorMessage(ctx, RULES_ERR.FS_STAT_SYNC);
			return;
		}

		const newPath = path.join(target, name);
		if (fs.existsSync(newPath)) {
			handleErrorMessage(ctx, RULES_ERR.FS_EXISTS_SYNC);
			return;
		}

		// 先排序
		filePaths.sort((a: { index: number; }, b: { index: number; }) => a.index - b.index);

		// 将文件流式写入新文件内
		const writeStream = fs.createWriteStream(newPath);
		
		await new Promise((resolve, reject) => {
			writeStream.on('finish', resolve);
			writeStream.on('error', reject);

			const bools = new Array(filePaths.length).fill(false);
			filePaths.forEach((filePath: { path: string; }, index: number) => {
				const readStream = fs.createReadStream(filePath.path);
				readStream.pipe(writeStream, { end: false });
				readStream.on('error', reject);

				readStream.on('end', () => {
					bools[index] = true;
					if (bools.every((item) => item)) {
						resolve(null);
					}
				});
			});
		});

		writeStream.end();

		// 删除原文件
		filePaths.forEach((filePath: { path: string; }) => {
			fs.unlinkSync(filePath.path);
		});

		ctx.body = {
			code: 0,
			message:'success',
		};
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}