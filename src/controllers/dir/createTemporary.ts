import fs from 'fs-extra';
import path from "path";
import { Context } from "../../types/index.ts";
import {
	handleTryCatchError,
} from '../utils/index.ts';
import crypto from 'crypto';

const temporaryRoot = process.env.ELECTRON_CACHE_PATH || path.join(process.cwd(), 'temporary');
export const createTemporaryDir = (ctx: Context) => {
	try {
		const pathId = generateUniqueString(8);
		const target = path.join(temporaryRoot, pathId);

		// 如果父级目录不存在，也创建，避免被用户主动删除
		if (!fs.existsSync(temporaryRoot)) {
			fs.mkdirSync(temporaryRoot);
		}
		
		fs.mkdirSync(target);
		ctx.body = {
			code: 0,
			message:'success',
			data: {
				path: target,
			}
		}
		
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}

function generateUniqueString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // 只包含字母和数字
  const randomBytes = crypto.randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % chars.length; // 取模确保索引在字符集范围内
    result += chars[index];
  }

  return result;
}