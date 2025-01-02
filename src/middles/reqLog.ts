import Koa from "koa";
import logger from "../utils/logger.ts";

export async function reqLogger(ctx: Koa.Context, next: Koa.Next) {
  const start = Date.now();

  await next();

  const ms = Date.now() - start;
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);

	// 记录请求时间、请求方法、请求路径、请求参数、请求体
	// 记录响应时间、响应状态码、响应体
	logger.info(`Request: ${JSON.stringify({
		requestTime: new Date(),
		method: ctx.method,
		path: ctx.path,
		params: ctx.params,
		body: ctx.request.body,
	})}`);
	// /fileMetadata 和 /download 不需要记录响应体
	if (ctx.path === '/fileMetadata' || ctx.path === '/download') {
		return;
	}
	logger.info(`Response: ${JSON.stringify({
		responseTime: new Date(),
		status: ctx.status,
		body: ctx.body,
	})}`);
}