export interface MetadataType {
	ino: number,
	path: string,
	size: number,
	ctime: Date,
	mtime: Date,
	type: string,
	children?: MetadataType[],
	parent: string | null,
}