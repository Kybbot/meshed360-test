import { FC } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { RestockLinesRow } from "./RestockLinesRow.tsx";

import { Button } from "@/components/shared/Button.tsx";

import { EmptyRestockLine, RestockFormValues, RestockLineType } from "@/@types/salesOrders/local.ts";
import { CreditNoteType, ExtendedSalesOrder, FulfilmentType } from "@/@types/salesOrders/api.ts";
import {
	TF,
	TFAddRow,
	TFOverflow,
	TFTable,
	TFTbody,
	TFTd,
	TFTh,
	TFThead,
	TFTr,
	TFWrapper,
} from "@/components/widgets/Table";
import { FulfilmentsSelect } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/ui/FulfilmentSelect.tsx";
import { useGetOrderFulfilment } from "@/entities/orders/api/queries/useGetOrderFulfilment.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { ProductType } from "@/@types/products.ts";
import { useGetOrderCreditNotes } from "@/entities/orders/api/queries/useGetOrderCreditNotes.ts";
import { CreditNoteSelect } from "@/pages/Orders/EditOrder/ui/tabs/Restock/ui/CreditNoteSelect.tsx";
import useProductsSelect from "@/pages/Orders/EditOrder/hooks/useProductsSelect.ts";

type Props = {
	orderInfo: ExtendedSalesOrder;
};

export const RestockLines: FC<Props> = ({ orderInfo }) => {
	const {
		control,
		formState: { disabled },
	} = useFormContext<RestockFormValues>();
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const { update, remove, append, fields, replace } = useFieldArray({
		name: "lines",
		control,
	});

	const { data: fulfilmentData, isSuccess: isFulfilmentSuccess } = useGetOrderFulfilment({
		organisationId: userAndOrgInfo?.orgId,
		orderId: orderInfo.id,
	});
	const { data: creditNotesData, isSuccess: isCreditNotesSuccess } = useGetOrderCreditNotes({
		organisationId: userAndOrgInfo?.orgId,
		orderId: orderInfo.id,
	});

	const currentLines = useWatch({
		name: "lines",
		control,
	});

	const productsSelect = useProductsSelect({
		sourceLines:
			fulfilmentData?.data?.fulfillments
				?.filter(({ picking }) => picking?.status === "AUTHORIZED")
				?.map(({ picking }) => picking!.lines)
				?.flat(1) || [],
		orgId: userAndOrgInfo!.orgId,
		currentLines,
	});

	const handleSelectFulfilment = (fulfilment: FulfilmentType) => {
		replace(
			fulfilment.picking!.lines.map((line): RestockLineType => {
				return {
					product: line.product as unknown as ProductType,
					batch: line.batchNumber ? { id: line.batchNumber, name: line.batchNumber } : undefined,
					quantity: line.quantity,
					expiryDate: line.expiryDate,
					location: line.warehouse,
				};
			}),
		);
	};

	const handleSelectCreditNote = (creditNote: CreditNoteType) => {
		replace(
			creditNote.lines.map((line): RestockLineType => {
				return {
					product: line.product as unknown as ProductType,
					batch: undefined,
					quantity: line.quantity,
					expiryDate: null,
					location: orderInfo.warehouse,
				};
			}),
		);
	};

	return (
		<div>
			<TF>
				<TFWrapper>
					<TFOverflow>
						<TFTable>
							<TFThead>
								<TFTr>
									<TFTh style={{ minWidth: "140px" }}>Product</TFTh>
									<TFTh style={{ minWidth: "140px" }}>Batch/Serial</TFTh>
									<TFTh>Expiry Date</TFTh>
									<TFTh>Unit</TFTh>
									<TFTh>Quantity</TFTh>
									<TFTh style={{ minWidth: "140px" }}>Restock Location</TFTh>
									<TFTh isActions></TFTh>
								</TFTr>
							</TFThead>

							{fields.length > 0 ? (
								<TFTbody>
									{fields.map((field, index) => (
										<RestockLinesRow
											key={field.id}
											index={index}
											fields={fields}
											update={update}
											remove={remove}
											control={control}
											productsSelect={productsSelect}
										/>
									))}
								</TFTbody>
							) : (
								<TFTbody>
									<TFTr>
										<TFTd isEmpty>No data available</TFTd>
									</TFTr>
								</TFTbody>
							)}
						</TFTable>
					</TFOverflow>
				</TFWrapper>
			</TF>
			<div style={{ marginTop: "-16px" }}>
				<TFAddRow>
					{isCreditNotesSuccess && creditNotesData.data.salesOrderCreditNotes.length > 0 && (
						<CreditNoteSelect
							disabled={disabled}
							creditNotes={creditNotesData.data.salesOrderCreditNotes}
							onValueChange={handleSelectCreditNote}
						/>
					)}
					{isFulfilmentSuccess && fulfilmentData.data.fulfillments.length > 0 && (
						<FulfilmentsSelect
							disabled={disabled}
							fulfilments={fulfilmentData.data.fulfillments}
							onValueChange={handleSelectFulfilment}
						/>
					)}
					<Button
						type="button"
						disabled={disabled}
						isSecondary
						onClick={() => append({ ...EmptyRestockLine, location: orderInfo.warehouse })}
					>
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#plus" />
						</svg>
						Add Row
					</Button>
				</TFAddRow>
			</div>
		</div>
	);
};
