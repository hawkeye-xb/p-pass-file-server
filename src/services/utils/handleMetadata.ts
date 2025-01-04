import fs from 'fs-extra';
import path from 'path';
import { MetadataType } from './type';

export function walkDir(target: string, parent: string | null = null) {
	const metadata = generatePathMetadata(target); // 错误持续抛出
	if (metadata instanceof Error) {
		throw metadata;
	}

	if (metadata.type === 'directory') {
		const children = fs.readdirSync(target);
		metadata.children = children.map((child) => {
			return walkDir(path.join(target, child), target);
		});
	}

	metadata.parent = parent;

	return metadata;
}

export function generatePathMetadata(target: string): MetadataType | Error {
	// 判断是否存在
	if (!fs.existsSync(target)) {
		return new Error('target not exists');
	}

	const stats = fs.statSync(target);
	// 是否是目录和文件
	if (!stats.isDirectory() && !stats.isFile()) {
		return new Error('target is not directory or file');
	}

	// todo: 有必要计算hash吗，性能消耗比较大
	const metadata = {
		ino: stats.ino,
		path: target,
		size: stats.size,
		ctime: stats.ctime,
		mtime: stats.mtime,
		type: 'unknown',
		parent: null,
	};
	if (stats.isDirectory()) {
		metadata.type = 'directory';
	} else if (stats.isFile()) {
		metadata.type = 'file';
	}

	return metadata;
}