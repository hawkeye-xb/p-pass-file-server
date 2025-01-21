import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import router from './routes/index.ts';
import serve from 'koa-static';
import path from 'path';
import { initWatcher, initWss } from './services/index.ts';
// import { reqLogger } from './middles/reqLog';

const app = new Koa();
const PORT = process.env.PORT || 2501;

// 静态文件服务
const __dirname = import.meta.url;
app.use(serve(path.join(__dirname, '../public')));

// 解析请求体
app.use(bodyParser());

// 配置 CORS
app.use(cors());

// 挂载路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务
const server = app.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`);
});
initWatcher();
initWss(server);
