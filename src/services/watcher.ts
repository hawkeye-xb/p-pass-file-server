import fs from 'fs-extra';
import chokidar from 'chokidar';
import path from 'path';

// todo: 监听过程被删除，还会监听吗？

// add watch, unwatch
const watchOptions = {
	ignored: /[\/\\]\./,
	persistent: true,
	depth: 20,
};
const watchers = new Map();
// export const watcher = chokidar.watch([], watchOptions);

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
	
	// target 是否已经被监听; 接口没有暴露
	if (watchers.has(target)) {
		return 'target is already watched';
	}
	const watcher = chokidar.watch([], watchOptions);
	watcher.add(target);
	watcher.on('all', (event, path) => {
		console.log(event, path);
	})
	watchers.set(target, watcher);
}

export const unWatch = (target: string) => {
	if (!watchers.has(target)) {
		return 'target is not watched';
	}
	const watcher = watchers.get(target);
	watcher.close();
	watchers.delete(target);
}