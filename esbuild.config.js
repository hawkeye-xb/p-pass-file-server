import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveNodePlugin = {
  name: 'resolve-node',
  setup(build) {
    // 拦截 .node 文件的引入
    build.onResolve({ filter: /\.node$/ }, (args) => {
      // 返回新的路径，指向复制后的 .node 文件
      return {
        path: path.join('dist', path.relative(process.cwd(), args.path)), // 修改为 dist 目录下的路径
        external: true, // 标记为外部依赖，避免 esbuild 尝试打包
      };
    });
  },
};

esbuild.build({
  entryPoints: ['src/index.ts'], // 入口文件
  bundle: true, // 打包依赖
  platform: 'node', // 指定为 Node.js 平台
  format: 'esm', // 设置为 ES 模块
  outfile: 'dist/index.js', // 输出文件
  // external: ['diskusage'], // 排除原生模块
  define: {
    'import.meta.url': JSON.stringify(`file://${path.resolve(__dirname, 'src/index.ts')}`), // 定义 import.meta.url
  },
	banner: {
    js: `
      import { createRequire } from 'node:module';
      const require = createRequire(import.meta.url);
    `,
  },
  plugins: [resolveNodePlugin], // 使用自定义插件
}).catch(() => process.exit(1));