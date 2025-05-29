import { Dispatch, FC, SetStateAction, useEffect } from "react";

import { useDeleteCategory } from "../api/mutations/useDeleteCategory";

import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { CategoryType } from "@/@types/categories";

type DeleteDialogProps = {
	orgId?: string;
	dialogState: boolean;
	currentItem: CategoryType;
	handleClearCurrentItem: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const DeleteDialog: FC<DeleteDialogProps> = ({
	orgId,
	dialogState,
	currentItem,
	setDialogState,
	handleClearCurrentItem,
}) => {
	const { mutate, error, isError, isPending, isSuccess } = useDeleteCategory();

	const handleCloseModal = () => {
		handleClearCurrentItem();
	};

	const handleOnSubmit = () => {
		if (currentItem.id && orgId) {
			mutate({ categoryId: currentItem.id, organisationId: orgId });
		}
	};

	useEffect(() => {
		if (isSuccess) {
			setDialogState(false);
			handleClearCurrentItem();
		}
	}, [isSuccess, setDialogState, handleClearCurrentItem]);

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent size="small" onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="infoDialog">
					<svg width="140" height="140" focusable="false" aria-hidden="true" className="infoDialog__svg">
						<use xlinkHref="/icons/illustrations.svg#info" />
					</svg>
					<DialogTitle asChild>
						<h3 className="infoDialog__title">Delete Category</h3>
					</DialogTitle>
					<p className="infoDialog__text">
						Are you sure you want to delete <span className="infoDialog__text--bold">{currentItem.name}</span>
						? This cannot be undone.
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
