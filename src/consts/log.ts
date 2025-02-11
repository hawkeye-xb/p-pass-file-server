import path from "path";

// const temporaryRoot = process.env.ELECTRON_CACHE_PATH || path.join(process.cwd(), 'temporary');
export const LOG_PATH = path.join(process.env.ELECTRON_CACHE_PATH || process.cwd(), "logs", "app.log");