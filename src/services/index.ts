// 初始化的时候做组合
export * from './watcher.ts';
export * from './ws.ts';
import { setAllChangeCallback, setAddWatched, setUnWatched } from './watcher.ts';
import { walkDir } from './utils/handleMetadata.ts';
import { addMetadatas, deleteMetadatas } from './metadata.ts';

export const initWatcher = () => {
	// 监听所有文件的变化
	setAllChangeCallback((event, filename) => {
		console.log('event', event, filename);
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
