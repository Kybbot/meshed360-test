import { FC } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { OrderServicesRow } from "./OrderServicesRow.tsx";

import {
	calculateFooterValues,
	calculateTotal,
} from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

import { Button } from "@/components/shared/Button.tsx";

import {
	DefaultServiceLine,
	WoolworthInvoicingFormValues,
	OrderServiceLineType,
} from "@/@types/salesOrders/local.ts";
import { ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";
import { ProductType } from "@/@types/products.ts";
import { TaxRateType } from "@/@types/selects.ts";
import {
	TF,
	TFAddRow,
	TFHr,
	TFOverflow,
	TFTable,
	TFTbody,
	TFTd,
	TFTfoot,
	TFTh,
	TFThead,
	TFThFoot,
	TFTr,
	TFWrapper,
} from "@/components/widgets/Table";

type Props = {
	priceListContentData: Record<string, number> | null;
	orderInfo: ExtendedSalesOrder;
};

export const OrderServices: FC<Props> = ({ priceListContentData, orderInfo }) => {
	const {
		control,
		formState: { disabled },
	} = useFormContext<WoolworthInvoicingFormValues>();
	const { remove, append, fields, replace } = useFieldArray({
		name: "serviceLines",
		control,
	});

	const allValues = useWatch({
		name: "serviceLines",
		control,
	});

	const { totalQuantity, totalPrice, total } = calculateFooterValues(allValues);

	return (
		<div>
			<h2 className="formTable__title">Additional Charges & Services</h2>
			<TF>
				<TFWrapper>
					<TFOverflow>
						<TFTable>
							<TFThead>
								<TFTr>
									<TFTh style={{ minWidth: "140px" }}>Product</TFTh>
									<TFTh>Comment</TFTh>
									<TFTh>Quantity</TFTh>
									<TFTh>Price</TFTh>
									<TFTh>Discount %</TFTh>
									<TFTh style={{ minWidth: "140px" }}>Tax</TFTh>
									<TFTh style={{ minWidth: "140px" }}>Account</TFTh>
									<TFTh isRight>Total</TFTh>
									<TFTh isActions></TFTh>
								</TFTr>
							</TFThead>

							{fields.length > 0 ? (
								<>
									<TFTbody>
										{fields.map((field, index) => (
											<OrderServicesRow
												key={field.id}
												index={index}
												remove={remove}
												control={control}
												priceListContentData={priceListContentData}
												orderInfo={orderInfo}
											/>
										))}
									</TFTbody>
									<TFTfoot>
										<TFTr>
											<TFThFoot>Total</TFThFoot>
											<TFThFoot />
											<TFThFoot>{totalQuantity}</TFThFoot>
											<TFThFoot>{totalPrice}</TFThFoot>
											<TFThFoot />
											<TFThFoot />
											<TFThFoot />
											<TFThFoot isRight>{total}</TFThFoot>
											<TFThFoot isActions />
										</TFTr>
									</TFTfoot>
								</>
							) : (
								<TFTbody>
									<TFTr>
										<TFTd isEmpty colSpan={9}>
											No data available
										</TFTd>
									</TFTr>
								</TFTbody>
							)}
						</TFTable>
					</TFOverflow>
				</TFWrapper>

				<TFAddRow>
					{!!orderInfo?.serviceLines && (
						<Button
							type="button"
							disabled={disabled}
							isSecondary
							onClick={() =>
								replace(
									orderInfo.serviceLines.map(
										(line): OrderServiceLineType => ({
											product: line.product as ProductType,
											comment: line.comment || "",
											quantity: line.quantity,
											unitPrice: line.unitPrice,
											discount: line.discount,
											account: line.account,
											taxType: line.taxRate as TaxRateType,
											total: calculateTotal(+line.unitPrice, +line.quantity, +line.discount).total,
										}),
									),
								)
							}
						>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#copy" />
							</svg>
							Copy from Order
						</Button>
					)}
					<Button type="button" disabled={disabled} isSecondary onClick={() => append(DefaultServiceLine)}>
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#plus" />
						</svg>
						Add Row
					</Button>
				</TFAddRow>
				<TFHr />
			</TF>
		</div>
	);
};
