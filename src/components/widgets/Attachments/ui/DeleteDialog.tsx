import { Dispatch, FC, SetStateAction } from "react";
import { useStore } from "zustand";

import { useDeleteAttachment } from "../api";

import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { orgStore } from "@/app/stores/orgStore";

import { AttachmentEntityType, AttachmentType } from "@/@types/attachments";

type Props = {
	entityId: string;
	dialogState: boolean;
	type: AttachmentEntityType;
	currentItem: AttachmentType;
	handleClearCurrentItem: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const DeleteDialog: FC<Props> = ({
	type,
	entityId,
	dialogState,
	currentItem,
	setDialogState,
	handleClearCurrentItem,
}) => {
	const { orgId } = useStore(orgStore);

	const { mutate, error, isError, isPending } = useDeleteAttachment(type);

	const handleCloseModal = () => {
		handleClearCurrentItem();
	};

	const handleOnSubmit = () => {
		if (!orgId) return;
		mutate(
			{
				entityId,
				organisationId: orgId,
				attachmentId: currentItem.id,
			},
			{
				onSuccess: () => {
					handleClearCurrentItem();
					setDialogState(false);
				},
			},
		);
	};

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent size="small" onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="infoDialog">
					<svg width="140" height="140" focusable="false" aria-hidden="true" className="infoDialog__svg">
						<use xlinkHref="/icons/illustrations.svg#info" />
					</svg>
					<DialogTitle asChild>
						<h3 className="infoDialog__title">Delete Attachmnet</h3>
					</DialogTitle>
					<p className="infoDialog__text">
						Are you sure you want to delete{" "}
						<span className="infoDialog__text--bold">{currentItem.fileName}</span>? This cannot be undone.
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
							onClick={handleOnSubmit}
							isLoading={isPending}
							disabled={isPending || !orgId}
						>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#delete" />
							</svg>
							Delete
						</Button>
					</div>
					{isError && error && <ErrorMessage error={error} />}
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
