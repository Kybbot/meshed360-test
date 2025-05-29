import { Dispatch, FC, SetStateAction } from "react";

import { Button } from "@/components/shared/Button";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

type DialogProps = {
	dialogState: boolean;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

const specTable = {
	headers: ["Field", "What is it?"],
	rows: [
		["SKU", "Product SKU, ordered but not yet fully billed."],
		["Product", "Name of the product, ordered but not yet fully billed."],
		["PO Number", "Purchase order number the product is ordered by."],
		["PO Date", "Date of the purchase order."],
		["Status", "Purchase status."],
		["Supplier", "Supplier name who received the purchase order."],
	],
};

export const SpecificationDialog: FC<DialogProps> = ({ dialogState, setDialogState }) => {
	const handleCloseModal = () => {
		setDialogState(false);
	};

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="commonDialog">
					<div className="commonDialog__header" style={{ display: "flex", justifyContent: "space-between" }}>
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Fields Specification</h3>
						</DialogTitle>
						<div className="commonDialog__btns btn-close">
							<DialogClose asChild>
								<Button
									type="button"
									onClick={handleCloseModal}
									style={{ padding: "8px 0", background: "transparent" }}
								>
									<svg width="18" height="18" focusable="false" aria-hidden="true" fill="#7E84A3">
										<use color="#7E84A3" xlinkHref="/icons/icons.svg#cancel" />
									</svg>
								</Button>
							</DialogClose>
						</div>
					</div>
					<div className="commonDialog__form">
						<p
							className="infoDialog__text"
							style={{
								textAlign: "left",
								fontSize: "12px",
								lineHeight: "120%",
								color: "background: #5A607F",
								margin: "0",
							}}
						>
							This report shows pending purchase orders. A purchase order is pending if it is at least in
							draft status but the invoice for ordered items has not been processed yet and/or stock is not
							received. Use this report to see the PO status and the number of items ordered, still to
							invoice, and still to receive for a supplier or PO #.
						</p>
						<div className="commonDialog__table">
							<div className="commonDialog__row">
								{specTable.headers.map((cell, idx) => (
									<p key={cell + idx} className="commonDialog__cell cell-header">
										{cell}
									</p>
								))}
							</div>

							{specTable.rows.map((row, idx) => (
								<div key={"dialRow" + idx} className="commonDialog__row">
									{row.map((cell, i) => (
										<p key={cell + i} className={`commonDialog__cell ${i === 0 && "cell-label"}`}>
											{cell}
										</p>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
