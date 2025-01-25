import Joi from "joi";
import { Context } from "@/types/index.ts";
import { joiValidate, handleErrorMessage, handleTryCatchError, RULES_ERR } from '../utils/index.ts';
import { getAllWatcherMetadatas } from "@/services/metadata.ts";

const getWatchPathMetadataSchema = Joi.object({
  target: Joi.string(),
});
export const getWatchPathMetadata = (ctx: Context) => {
	try {
		const value = joiValidate(getWatchPathMetadataSchema, ctx);
		if (value === null) {
			return;
		}
		const { target } = value;
		const data = getAllWatcherMetadatas(target);
		ctx.body = {
			code: 0,
			message: "success",
			data,
		};
	} catch (error) {
		handleTryCatchError(ctx, error);
	}
}