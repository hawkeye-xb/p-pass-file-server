import Koa, { ParameterizedContext } from 'koa';
import Router from 'koa-router';

export type HandleContextBody<T> = Koa.Context & {
	request: Koa.Context['request'] & {
		body: T;
	}
}

export type Context = ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>;

export type HandlePutContextBody<T> = ParameterizedContext<
	any,
	Router.IRouterParamContext<any, {}>,
	any
> & {
	request: Koa.Context['request'] & {
		body: T;
	}
}
export type FileMetadata = {
  hash?: string;
  name: string;
  path: string;
  size: number;
  ctime: Date;
  mtime: Date;
  isDirectory: boolean;
  children?: FileMetadata[];
}