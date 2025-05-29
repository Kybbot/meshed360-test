import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

import { useDefaultTemplate, useDeleteTemplate, useUploadTemplate } from "../../api";

import { Loader } from "@/components/shared/Loader";
import { Spinner } from "@/components/shared/Spinner";
import { Checkbox } from "@/components/shared/form/Checkbox";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";
import { downloadDocxTemplate } from "@/utils/download";

import { TemplateType } from "@/@types/documentTemplates";

type Props = {
	item: TemplateType;
};

export const Template: FC<Props> = ({ item }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [isDownload, setDownload] = useState(false);
	const [currentFile, setCurrentFile] = useState<File | null>(null);

	const { isPending: isPendingUpload, mutate: mutateUpload } = useUploadTemplate();
	const { isPending: isPendingDelete, mutate: mutateDelete } = useDeleteTemplate();
	const { isPending: isPendingDefault, mutate: mutateDefault } = useDefaultTemplate();

	const disabledField = isDownload || isPendingUpload || isPendingDelete || isPendingDefault;

	const handleDefault = (event: ChangeEvent<HTMLInputElement>) => {
		mutateDefault({ templateId: item.id, templateType: item.type, body: { value: event.target.checked } });
	};

	const handleDelete = () => {
		mutateDelete({ templateId: item.id, templateType: item.type });
	};

	const handleUpload = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const files = event.target.files;

		if (files) {
			setCurrentFile(files[0]);
		}
	};

	const handleDownload = async () => {
		setDownload(true);

		try {
			const { data } = await axiosInstance.get<Blob>(`api/settings/general/document-templates/${item.id}`, {
				responseType: "blob",
			});

			downloadDocxTemplate(data, item.name);
			toast.success("File was successfully downloaded");
		} catch (error) {
			if (isAxiosError(error)) {
				showError(error);
			} else if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setDownload(false);
		}
	};

	useEffect(() => {
		if (currentFile) {
			const formData = new FormData();
			formData.append("document", currentFile);

			mutateUpload(
				{ formData, templateId: item.id, templateType: item.type },
				{
					onSuccess() {
						setCurrentFile(null);
					},
				},
			);
		}
	}, [item, currentFile, mutateUpload]);

	return (
		<div className="documentTemplate">
			<p className="documentTemplate__name">{item.name}</p>
			<div className="documentTemplate__actions">
				{item.uploaded && (
					<>
						{isPendingDefault ? (
							<Spinner />
						) : (
							<Checkbox
								id="aa"
								isLabelBefore
								label="Default"
								isTemplateLabel
								checked={item.default}
								onChange={handleDefault}
								disabled={disabledField}
								hideLabel={!item.default}
							/>
						)}
					</>
				)}
				<input type="file" accept=".docx" className="srOnly" ref={fileInputRef} onChange={handleFileChange} />
				<button
					type="button"
					onClick={handleUpload}
					disabled={disabledField}
					className="documentTemplate__btn"
				>
					{isPendingUpload ? <Loader isSmall /> : "Upload"}
				</button>
				{item.uploaded && (
					<button
						type="button"
						disabled={disabledField}
						onClick={handleDownload}
						className="documentTemplate__btn"
					>
						{isDownload ? <Loader isSmall /> : "Download"}
					</button>
				)}
				<button
					type="button"
					onClick={handleDelete}
					disabled={disabledField}
					className="documentTemplate__delete"
				>
					{isPendingDelete ? (
						<Spinner width="16" height="16" />
					) : (
						<svg focusable="false" aria-hidden="true" width="16" height="16">
							<use xlinkHref="/icons/icons.svg#crossInCircle" />
						</svg>
					)}
				</button>
			</div>
		</div>
	);
};
