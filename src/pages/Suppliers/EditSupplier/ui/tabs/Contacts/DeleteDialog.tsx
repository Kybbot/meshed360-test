import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import { useParams } from "react-router";

import { useUpdateSupplierContacts } from "../../../api/mutations/useUpdateSupplierContact";

import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { ContactsType } from "@/@types/suppliers";

type DeleteDialogProps = {
	dialogState: boolean;
	currentItemIndex: number;
	currentItems: ContactsType[];
	handleClearCurrentItem: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const DeleteDialog: FC<DeleteDialogProps> = ({
	dialogState,
	currentItems,
	currentItemIndex,
	setDialogState,
	handleClearCurrentItem,
}) => {
	const { supplierId } = useParams();

	const { mutate, error, isError, isPending, isSuccess } = useUpdateSupplierContacts();

	const cuurentItem = useMemo(
		() => currentItems.find((_item, index) => index === currentItemIndex),
		[currentItems, currentItemIndex],
	);

	const handleCloseModal = () => {
		handleClearCurrentItem();
	};

	const handleOnSubmit = () => {
		const updatedArr = currentItems.filter((_item, index) => index !== currentItemIndex);

		if (supplierId) {
			mutate({
				supplierId,
				body: updatedArr,
			});
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
						<h3 className="infoDialog__title">Delete Address</h3>
					</DialogTitle>
					<p className="infoDialog__text">
						Are you sure you want to delete{" "}
						<span className="infoDialog__text--bold">{cuurentItem?.name ?? ""}</span>? This cannot be undone.
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
							disabled={isPending || !supplierId}
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
