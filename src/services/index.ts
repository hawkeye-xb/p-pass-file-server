// 初始化的时候做组合

export * from './watcher.ts';
export * from './ws.ts';

import path from 'path';
import { setAllChangeCallback, setAddWatched, setUnWatched } from './watcher.ts';
import { walkDir } from './utils/handleMetadata.ts';
import { addMetadatas, deleteMetadatas, updateMetadata } from './metadata.ts';

const parentPathSet = new Set<string>();

// 延迟100ms，避免频繁触发；如果有新调用，则取消上一次的
let timer: NodeJS.Timeout | null = null;
const handleAllChange = () => {
	if (timer) {
		clearTimeout(timer);
	}
	timer = setTimeout(() => {
		// set 转数组
		const targets = filterParentPaths(Array.from(parentPathSet))
		console.log('更新的路径:', targets);
		
		targets.forEach((target) => {
			const metadata = walkDir(target);
			const res = updateMetadata(target, metadata);
			if (!res) {
				console.warn(`updateMetadata ${path} failed`);
			}
		});

		parentPathSet.clear();
	}, 100);
}

function filterParentPaths(paths: string[]) {
	// 首先对路径进行排序，确保父目录在前
	paths.sort();

	const result = [];
	let previousPath = '';

	for (const path of paths) {
			// 如果当前路径不是前一个路径的子目录，则将其加入结果数组
			if (!path.startsWith(previousPath + '/') || previousPath === '') {
					result.push(path);
					previousPath = path;
			}
	}

	return result;
}

export const initWatcher = () => {
	// 监听所有文件的变化
	setAllChangeCallback((event, filename) => {
		parentPathSet.add(path.dirname(filename));

		handleAllChange();
	});
	// 监听某个文件的变化
	setAddWatched((filename) => {
		console.log('add watched', filename);
		const metadata = walkDir(filename);
		addMetadatas(filename, metadata);
	});
	// 取消监听某个文件的变化
	setUnWatched((filename) => {
		console.log('un watched', filename);
		deleteMetadatas(filename);
	});
}
