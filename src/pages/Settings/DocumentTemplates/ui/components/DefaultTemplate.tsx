import { FC, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

import { useDefaultTemplate } from "../../api";

import { Loader } from "@/components/shared/Loader";
import { Spinner } from "@/components/shared/Spinner";
import { Checkbox } from "@/components/shared/form/Checkbox";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";
import { downloadDocxTemplate } from "@/utils/download";

import { TemplateType, TemplateTypes } from "@/@types/documentTemplates";

type Props = {
	type: TemplateTypes;
	uploadedTemplates: TemplateType[];
};

export const DefaultTemplate: FC<Props> = ({ type, uploadedTemplates }) => {
	const [isDownload, setDownload] = useState(false);

	const { isPending: isPendingDefault, mutate: mutateDefault } = useDefaultTemplate();

	const disabledField = isDownload || isPendingDefault;

	const isSomeDefault = useMemo(() => uploadedTemplates.some((item) => item.default), [uploadedTemplates]);

	const handleDefault = () => {
		const defaultTemplate = uploadedTemplates.find((item) => item.default);

		if (defaultTemplate) {
			mutateDefault({
				body: { value: false },
				templateId: defaultTemplate.id,
				templateType: defaultTemplate.type,
			});
		}
	};

	const handleDownload = async () => {
		setDownload(true);

		try {
			const { data } = await axiosInstance.get<Blob>(
				`api/settings/general/document-templates/example?type=${type}`,
				{
					responseType: "blob",
				},
			);

			downloadDocxTemplate(data, `Default_${type}`);
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

	return (
		<div className="documentTemplate">
			<p className="documentTemplate__name">Default_{type}</p>
			<div className="documentTemplate__actions">
				{isPendingDefault ? (
					<Spinner />
				) : (
					<Checkbox
						id="aa"
						isLabelBefore
						label="Default"
						isTemplateLabel
						onChange={handleDefault}
						checked={!isSomeDefault}
						disabled={disabledField}
						hideLabel={isSomeDefault}
					/>
				)}
				<button
					type="button"
					disabled={disabledField}
					onClick={handleDownload}
					className="documentTemplate__btn"
				>
					{isDownload ? <Loader isSmall /> : "Download"}
				</button>
			</div>
		</div>
	);
};
