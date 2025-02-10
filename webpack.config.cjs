const path = require('path');

module.exports = {
  entry: './src/index.ts', // 入口文件
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2', // 输出为 CommonJS 格式
  },
  target: 'node', // 指定为 Node.js 环境
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: {
    // 指定外部依赖，避免打包到输出文件中
    '@koa/multer': 'commonjs @koa/multer',
    multer: 'commonjs multer',
    fs: 'commonjs fs',
    path: 'commonjs path',
  },
};