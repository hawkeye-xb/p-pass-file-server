import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'node_modules/diskusage/build/Release');
const destDir = path.join(__dirname, 'dist/build/Release'); // 假设你的输出目录是 `dist`

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(path.join(srcDir, 'diskusage.node'), path.join(destDir, 'diskusage.node'));