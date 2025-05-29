export const ALLOWED_FILE_TYPES = ["text/csv"];

export function validateFileType(file: File) {
	return ALLOWED_FILE_TYPES.includes(file.type);
}
