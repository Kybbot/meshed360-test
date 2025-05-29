import { Dispatch, FC, SetStateAction } from "react";
import { useStore } from "zustand";

import { useUploadAttachment } from "../api";

import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { orgStore } from "@/app/stores/orgStore";

import { AttachmentEntityType } from "@/@types/attachments";

type Props = {
	newFile: File;
	entityId: string;
	dialogState: boolean;
	type: AttachmentEntityType;
	handleClearFile: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const OverrideDialog: FC<Props> = ({
	type,
	newFile,
	entityId,
	dialogState,
	setDialogState,
	handleClearFile,
}) => {
	const { orgId } = useStore(orgStore);

	const { mutate, error, isError, isPending } = useUploadAttachment(type);

	const handleCloseModal = () => {
		handleClearFile();
	};

	const handleOnSubmit = () => {
		if (!orgId) return;

		if (orgId) {
			const formData = new FormData();
			formData.append("file", newFile);
			formData.append("override", String(true));

			mutate(
				{ entityId, formData, organisationId: orgId },
				{
					onSuccess: () => {
						handleClearFile();
						setDialogState(false);
					},
				},
			);
		}
	};

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent size="small" onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="infoDialog">
					<svg width="140" height="140" focusable="false" aria-hidden="true" className="infoDialog__svg">
						<use xlinkHref="/icons/illustrations.svg#info" />
					</svg>
					<DialogTitle asChild>
						<h3 className="infoDialog__title">File Already Exists</h3>
					</DialogTitle>
					<p className="infoDialog__text">
						The file <span className="infoDialog__text--bold">{newFile.name}</span> already exists. Do you
						want to replace it?
					</p>

					<div className="infoDialog__btns">
						<DialogClose asChild>
							<Button type="button" isSecondary onClick={handleCloseModal}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#cancel" />
								</svg>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="button"
							isLoading={isPending}
							onClick={handleOnSubmit}
							disabled={isPending || !orgId}
						>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#save" />
							</svg>
							Replace
						</Button>
					</div>
					{isError && error && <ErrorMessage error={error} />}
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
