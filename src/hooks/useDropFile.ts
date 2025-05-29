import { ChangeEvent, useRef, useState, DragEvent, useCallback } from "react";
import toast from "react-hot-toast";

import { validateFileType } from "@/utils/files";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const useDropFile = (useFileTypeValidation?: boolean) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [dragActive, setDragActive] = useState<boolean>(false);
	const [currentFile, setCurrentFile] = useState<File | null>(null);

	const handleClearFile = useCallback(() => {
		setCurrentFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, []);

	const handleFileButton = useCallback(() => {
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
			fileInputRef.current.click();
		}
	}, []);

	const handleFileChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			event.preventDefault();

			const files = event.target.files;

			if (files && files[0]) {
				const valid = validateFileType(files[0]);

				if (!valid && useFileTypeValidation) {
					toast.error("Invalid file type");
					return;
				}

				if (files[0].size > MAX_FILE_SIZE) {
					toast.error("File size exceeds the maximum limit of 10MB");
					return;
				}
				setCurrentFile(files[0]);
			}
		},
		[useFileTypeValidation],
	);

	const handleDrag = useCallback((event: DragEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();

		if (event.type === "dragenter" || event.type === "dragover") {
			setDragActive(true);
		} else if (event.type === "dragleave") {
			setDragActive(false);
		}
	}, []);

	const handleDrop = useCallback(
		(event: DragEvent<HTMLFormElement>) => {
			event.preventDefault();
			event.stopPropagation();

			const files = event.dataTransfer.files;

			if (files && files[0]) {
				if (files.length > 1) {
					toast.error("You can only upload one file at a time.");
					setDragActive(false);
					return;
				}

				const valid = validateFileType(files[0]);

				if (!valid && useFileTypeValidation) {
					toast.error("Invalid file type");
					setDragActive(false);
					return;
				}

				if (files[0].size > MAX_FILE_SIZE) {
					toast.error("File size exceeds the maximum limit of 10MB");
					return;
				}

				setCurrentFile(files[0]);
				setDragActive(false);
			}
		},
		[useFileTypeValidation],
	);

	return [
		fileInputRef,
		dragActive,
		currentFile,
		handleClearFile,
		handleFileButton,
		handleFileChange,
		handleDrag,
		handleDrop,
	] as const;
};
