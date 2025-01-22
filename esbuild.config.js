import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

esbuild.build({
  entryPoints: ['src/index.ts'], // 入口文件
  bundle: true, // 打包依赖
  platform: 'node', // 指定为 Node.js 平台
  format: 'esm', // 设置为 ES 模块
  outfile: 'dist/index.js', // 输出文件
  external: [], // 排除原生模块
  define: {
    'import.meta.url': JSON.stringify(`file://${path.resolve(__dirname, 'src/index.ts')}`), // 定义 import.meta.url
  },
	banner: {
    js: `
      import { createRequire } from 'node:module';
      const require = createRequire(import.meta.url);
    `,
  },
}).catch(() => process.exit(1));