export function getFileId(file: File) {
	return `${file.name}-${String(file.size)}-${String(file.lastModified)}`;
}
