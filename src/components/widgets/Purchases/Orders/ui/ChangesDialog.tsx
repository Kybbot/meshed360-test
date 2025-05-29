import { Dispatch, FC, SetStateAction } from "react";
import { useMutationState } from "@tanstack/react-query";

import { Button } from "@/components/shared/Button";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

type Props = {
	dialogState: boolean;
	handleSubmitChanges: () => void;
	handleCancleChanges: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
	type: "Stok/Bill" | "BlindBill" | "TaxInclusive" | "OnlyAdditionalCost" | null;
};

export const ChangesDialog: FC<Props> = ({
	type,
	dialogState,
	setDialogState,
	handleSubmitChanges,
	handleCancleChanges,
}) => {
	const updateStatus = useMutationState({
		filters: { mutationKey: ["update-purchase-order"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = updateStatus.includes("pending");

	const handleOnSubmit = () => {
		handleSubmitChanges();
	};

	const handleCloseModal = () => {
		handleCancleChanges();
	};

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent size="small" onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="infoDialog">
					<svg width="140" height="140" focusable="false" aria-hidden="true" className="infoDialog__svg">
						<use xlinkHref="/icons/illustrations.svg#info" />
					</svg>
					<DialogTitle asChild>
						<h3 className="infoDialog__title">Save Changes</h3>
					</DialogTitle>
					<p className="infoDialog__text">
						{type === "Stok/Bill" && (
							<>
								You have changed Stock First/Bill First. Please confirm to save changes or cancel to retain
								the previous selection.
							</>
						)}
						{type === "BlindBill" && (
							<>
								You have changed Blind Bill. Please confirm to save changes or cancel to retain the previous
								selection.
							</>
						)}
						{type === "TaxInclusive" && (
							<>
								You have changed Tax Inclusive. Please confirm to save changes or cancel to retain the
								previous selection.
							</>
						)}
						{type === "OnlyAdditionalCost" && (
							<>
								You have changed Only Additional Cost. Please confirm to save changes or cancel to retain the
								previous selection.
							</>
						)}
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
						<Button type="button" isLoading={isPending} disabled={isPending} onClick={handleOnSubmit}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#save" />
							</svg>
							Save
						</Button>
					</div>
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
