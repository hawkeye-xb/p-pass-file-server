import log4js from "log4js";
import { LOG_PATH } from '../consts/log';

log4js.configure({
  appenders: {
    console: { type: "console" }, // 控制台输出
    file: { type: "file", filename: LOG_PATH }, // 文件输出
  },
  categories: {
    default: { appenders: ["console", "file"], level: "debug" },
    'node-server': { appenders: ['file', 'console'], level: 'debug' } // 自定义日志级别
  }
});

const logger = log4js.getLogger("node-server");

export default logger;