import { Context } from "@/types/index.ts";

export enum ERROR_STATUS {
	PARAMS_ERROR = 400,
	SERVER_ERROR = 500,
}

export enum ERROR_CODE {
	SERVER_ERROR = 500,

	PARAMS_ERROR = 400,
	// dir
	PARAMS_VALIDATE_ERROR = 40001,
	FS_NOT_EXIST = 40002,
	FOLDER_ALREADY_EXISTS = 40003,
	NOT_A_DIRECTORY = 40004,
	FOLDER_NOT_EMPTY = 40005,
}

export const ERROR_MSG = {
	[ERROR_CODE.FS_NOT_EXIST]: 'The destination folder does not exist',
	[ERROR_CODE.FOLDER_ALREADY_EXISTS]: 'The folder already exists',
	[ERROR_CODE.NOT_A_DIRECTORY]: 'The target is not a directory',
	[ERROR_CODE.FOLDER_NOT_EMPTY]: 'The folder is not empty',
}


export const handleErrorMessage = (ctx: Context, info: {
	status: number,
	code: number, // 业务错误码
	message: string,
}) => {
	ctx.status = info.status;
	ctx.body = {
		code: info.code,
		message: info.message,
	};
}

export const handleTryCatchError = (ctx: Context, error: any) => {
	handleErrorMessage(ctx, {
		status: ERROR_STATUS.SERVER_ERROR,
		code: error.code,
		message: error.message,
	});
}