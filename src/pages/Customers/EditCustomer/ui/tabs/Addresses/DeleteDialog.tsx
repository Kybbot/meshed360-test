import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import { useParams } from "react-router";

import { useUpdateCustomerAddress } from "../../../api/mutations/useUpdateCustomerAddress";

import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { NormalizedAddressesData } from "@/@types/customers";

type DeleteDialogProps = {
	dialogState: boolean;
	currentItemIndex: number;
	currentItems: NormalizedAddressesData;
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
	const { customerId } = useParams();

	const { mutate, error, isError, isPending, isSuccess } = useUpdateCustomerAddress();

	const cuurentItem = useMemo(
		() => currentItems.addresses.find((_item, index) => index === currentItemIndex),
		[currentItems, currentItemIndex],
	);

	const handleCloseModal = () => {
		handleClearCurrentItem();
	};

	const handleOnSubmit = () => {
		const updatedArr = currentItems.addresses.filter((_item, index) => index !== currentItemIndex);

		if (customerId) {
			mutate({
				customerId,
				body: { addresses: updatedArr },
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
						<span className="infoDialog__text--bold">{cuurentItem?.addressLine1 ?? ""}</span>? This cannot be
						undone.
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
							disabled={isPending || !customerId}
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
