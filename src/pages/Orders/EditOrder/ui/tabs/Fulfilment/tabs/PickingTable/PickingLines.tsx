import { FC } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { PickingLinesRow } from "./PickingLinesRow.tsx";

import { Button } from "@/components/shared/Button.tsx";

import {
	EmptyFulfilmentPickingLine,
	PickingFulfilmentFormValues,
	PickingFulfilmentLineType,
} from "@/@types/salesOrders/local.ts";
import { ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";
import { ProductType } from "@/@types/products.ts";
import {
	TF,
	TFAddRow,
	TFHr,
	TFOverflow,
	TFTable,
	TFTbody,
	TFTd,
	TFTh,
	TFThead,
	TFTr,
	TFWrapper,
} from "@/components/widgets/Table";
import useProductsSelect from "@/pages/Orders/EditOrder/hooks/useProductsSelect.ts";
import { orgStore } from "@/app/stores/orgStore.ts";
import { useStore } from "zustand";
import { orderStore } from "@/app/stores/orderStore.ts";

type Props = {
	orderInfo: ExtendedSalesOrder;
	isAuthorized: boolean;
};

export const PickingLines: FC<Props> = ({ orderInfo, isAuthorized }) => {
	const {
		control,
		formState: { disabled },
	} = useFormContext<PickingFulfilmentFormValues>();

	const { orgId } = useStore(orgStore);
	const { fulfilment } = useStore(orderStore);
	const { update, remove, append, fields, replace } = useFieldArray({
		name: "lines",
		control,
	});

	const currentLines = useWatch({
		name: "lines",
		control,
	});

	const productsSelect = useProductsSelect({
		sourceLines: orderInfo.orderLines,
		orgId: orgId!,
		fulfilment,
		currentLines,
	});

	const handleCopyFromOrder = () => {
		replace(
			orderInfo.orderLines.map((line): PickingFulfilmentLineType => {
				const productForSelect = productsSelect.products.find(({ id }) => line.product.id === id);
				return {
					...EmptyFulfilmentPickingLine,
					product: line.product as ProductType,
					location: orderInfo.warehouse,
					quantity: productForSelect ? String(productForSelect.count) : line.quantity,
				};
			}),
		);
	};

	return (
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
								<TFTh>Available Quantity</TFTh>
								<TFTh>Quantity</TFTh>
								<TFTh>Outstanding</TFTh>
								<TFTh style={{ minWidth: "140px" }}>Location</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>

						{fields.length > 0 ? (
							<TFTbody>
								{fields.map((field, index) => (
									<PickingLinesRow
										key={field.id}
										index={index}
										fields={fields}
										update={update}
										remove={remove}
										control={control}
										productsSelect={productsSelect}
										isAuthorized={isAuthorized}
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

			<TFAddRow>
				{!!orderInfo.orderLines.length && (
					<Button type="button" disabled={disabled} isSecondary onClick={handleCopyFromOrder}>
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#copy" />
						</svg>
						Copy from Order
					</Button>
				)}
				<Button
					type="button"
					disabled={disabled}
					isSecondary
					onClick={() => append({ ...EmptyFulfilmentPickingLine, location: orderInfo.warehouse })}
				>
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#plus" />
					</svg>
					Add Row
				</Button>
			</TFAddRow>
			<TFHr />
		</TF>
	);
};
