import fs from 'fs-extra';
import chokidar, { FSWatcher } from 'chokidar';
// import path from 'path'; // todo: 确保Map的key能对应。

const watchOptions = {
	ignored: /[\/\\]\./,
	persistent: true,
	ignoreInitial: true, // 忽略初始扫描
	depth: 20,
};
const watchers: Map<string, FSWatcher> = new Map();

let allChangeCallback: (event: string, path: string) => void;
export const setAllChangeCallback = (callback: (event: string, path: string) => void) => {
	allChangeCallback = callback;
}

let addWatched: (path: string) => void;
export const setAddWatched = (callback: (path: string) => void) => {
	addWatched = callback;
}

let unWatched: (path: string) => void;
export const setUnWatched = (callback: (path: string) => void) => {
	unWatched = callback;
}

// 只监听目录
export const addWatch = (target: string) => {
	const err = addValidate(target, watchers);
	if (err) {
		return err;
	}
	
	const watcher = chokidar.watch([], watchOptions);
	watcher.add(target);
	watcher.on('all', (event, path) => {
		allChangeCallback(event, path);
	})
	watchers.set(target, watcher);
	addWatched(target);
}

export const unWatch = (target: string) => {
	if (!watchers.has(target)) {
		return 'target is not watched';
	}
	const watcher = watchers.get(target);
	if (!watcher) {
		return 'watcher is not defined';
	}
	watcher.close();
	watchers.delete(target);
	unWatched(target);
}

function addValidate(target: string, instances: Map<string, FSWatcher>) {
	// 接口处已经校验
	if (!fs.existsSync(target)) {
		return 'target not exists';
	}
	if (!fs.statSync(target).isDirectory()) {
		return 'target is not directory';
	}
	
	// 判断是否有监听权限>?
	// target 是否已经被监听; 接口没有暴露
	if (instances.has(target)) {
		return 'target is already watched';
	}

	// 遍历 Instances 的key，判断是否有父子关系
	for (const key of instances.keys()) {
		if (key.startsWith(target)) {
			return 'target is child of other watched directory';
		}
		if (target.startsWith(key)) {
			return 'target is parent of other watched directory';
		}
	}

	return null;
}