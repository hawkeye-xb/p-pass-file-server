import fs from 'fs-extra';
import chokidar from 'chokidar';
import path from 'path';

// todo: 监听过程被删除，还会监听吗？

// add watch, unwatch
export const watcher = chokidar.watch([], {
	ignored: /[\/\\]\./,
	persistent: true,
	depth: 20,
});

// 只监听目录
export const addWatch = (target: string) => {
	// target 是否存在
	if (!fs.existsSync(target)) {
		return 'target not exists';
	}
	// target 是否为目录
	if (!fs.statSync(target).isDirectory()) {
		return 'target is not directory';
	}
	
	// 判断是否有监听权限>?
	
	// target 是否已经被监听
	if (watcher.getWatched().hasOwnProperty(target)) {
		return 'target is already watched';
	}
	
	watcher.add(target);
}

export const unWatch = (target: string) => {
	// target 是否被监听
	// 1. 获取目录部分
	const dir = path.dirname(target); // /Users/lixixi/github/my-network-disk/file-server

	// 2. 获取最后一部分
	const base = path.basename(target); // NAS

	if (!watcher.getWatched().hasOwnProperty(
		path.join(dir, base)
	)) {
		return 'target is not watched';
	}
	// todo: 删除path及其以下子path
	watcher.unwatch(target);
}