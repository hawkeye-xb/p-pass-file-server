import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDirDiskUsage = path.join(__dirname, 'node_modules/diskusage/build/Release');
const destDirDiskUsage = path.join(__dirname, 'dist/build/Release'); // 假设你的输出目录是 `dist`

if (!fs.existsSync(destDirDiskUsage)) {
  fs.mkdirSync(destDirDiskUsage, { recursive: true });
}

console.log(path.join(srcDirDiskUsage, 'diskusage.node'), path.join(destDirDiskUsage, 'diskusage.node'));
fs.copyFileSync(path.join(srcDirDiskUsage, 'diskusage.node'), path.join(destDirDiskUsage, 'diskusage.node'));

// 添加 trash 依赖的复制
const srcDirTrash = path.join(__dirname, 'node_modules/trash');
const destDirTrash = path.join(__dirname, 'dist/node_modules/trash');

if (!fs.existsSync(destDirTrash)) {
  fs.mkdirSync(destDirTrash, { recursive: true });
}

fs.cpSync(srcDirTrash, destDirTrash, { recursive: true });
