import fs from 'fs-extra';
// import Joi from "joi";
import path from "path";
// import { Context } from "@/types/index.ts";
import {
	// joiValidate,
	handleErrorMessage,
	handleTryCatchError,
	RULES_ERR
} from '../utils/index.ts';

import multer from 'koa-multer';
import { Next } from 'koa';

// 上传到目标目录
const storage = multer.diskStorage({
	destination: function (req: any, file: any, cb: any) {
		const target = req.body.target;

		// todo: 参数验证; error handle

		cb(null, target);
	},

	// filename 不做处理
	filename: function (req: any, file: multer.File, cb: (arg0: null, arg1: string) => void) {
		// const filename = req.body.name + path.extname(file.originalname);
		// 省得名称乱码要处理了
		cb(null, req.body.name);
	}
});
export const uploadInstance = multer({ storage });

export const uploadFile = async (ctx: any, next: Next) => {
	try {
		await uploadInstance.single('file')(ctx, next);

		const file = ctx.req.file;

		if (!file) {
			handleErrorMessage(ctx, {
				...RULES_ERR.NOT_FILE_UPLOAD,
				message: 'check the parameters',
			});
			return;
		}

		ctx.body = {
			code: 0,
			message:'success',
			data: {
				path: file.path,
			}
		};
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
};