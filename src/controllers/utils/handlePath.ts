// 带 / 结尾的是目录，不带 / 结尾的可以是文件
export const handleDirPath = (inputPath: string) => {
	if (!inputPath.endsWith('/')) {
		return inputPath + '/';
	}
	return inputPath;
}