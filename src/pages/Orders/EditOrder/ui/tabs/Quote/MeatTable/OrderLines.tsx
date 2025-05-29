import { FC } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { OrderLinesRow } from "./OrderLinesRow.tsx";

import {
	calculateMeatFooterValues,
	calculateTotal,
} from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

import { Button } from "@/components/shared/Button.tsx";

import { EmptyMeatOrderLine, MeatOrderFormValues, MeatOrderLineType } from "@/@types/salesOrders/local.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { ExtendedSalesOrder, QuoteType } from "@/@types/salesOrders/api.ts";
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
	errors: FieldErrors<MeatOrderFormValues>;
	control: Control<MeatOrderFormValues, unknown>;
	register: UseFormRegister<MeatOrderFormValues>;
	setValue: UseFormSetValue<MeatOrderFormValues>;
	priceListContentData: Record<string, number> | null;
	isSubmitted: boolean;
	disabled: boolean;
	quote?: QuoteType;
	orderInfo: ExtendedSalesOrder;
};

export const OrderLines: FC<Props> = ({
	errors,
	control,
	register,
	setValue,
	priceListContentData,
	isSubmitted,
	disabled,
	quote,
	orderInfo,
}) => {
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const { update, remove, append, fields, replace } = useFieldArray({
		name: "lines",
		control,
	});

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const total = calculateMeatFooterValues(allValues);

	return (
		<TF>
			<TFWrapper>
				<TFOverflow>
					<TFTable>
						<TFThead>
							<TFTr>
								<TFTh style={{ minWidth: "140px" }}>Product</TFTh>
								<TFTh>Comment</TFTh>
								<TFTh>Quantity</TFTh>
								<TFTh>Mass</TFTh>
								<TFTh>Avg KG</TFTh>
								<TFTh>Price</TFTh>
								<TFTh style={{ minWidth: "140px" }}>Account</TFTh>
								<TFTh>Discount %</TFTh>
								<TFTh style={{ minWidth: "140px" }}>Tax</TFTh>
								<TFTh>Margin</TFTh>
								{userAndOrgInfo?.trackingCategoryAFiltered?.categories.length && (
									<TFTh style={{ minWidth: "140px" }}>{userAndOrgInfo.trackingCategoryAFiltered.name}</TFTh>
								)}
								{userAndOrgInfo?.trackingCategoryBFiltered?.categories.length && (
									<TFTh style={{ minWidth: "140px" }}>{userAndOrgInfo.trackingCategoryBFiltered.name}</TFTh>
								)}
								<TFTh>Total</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>

						{fields.length > 0 ? (
							<>
								<TFTbody>
									{fields.map((field, index) => (
										<OrderLinesRow
											key={field.id}
											index={index}
											fields={fields}
											errors={errors}
											update={update}
											remove={remove}
											control={control}
											setValue={setValue}
											register={register}
											priceListContentData={priceListContentData}
											disabled={disabled}
											isSubmitted={isSubmitted}
											orderInfo={orderInfo}
										/>
									))}
								</TFTbody>
								<TFTfoot>
									<TFTr>
										<TFThFoot>Total</TFThFoot>
										<TFThFoot />
										<TFThFoot>{total.totalQuantity}</TFThFoot>
										<TFThFoot>{total.totalMass}</TFThFoot>
										<TFThFoot>{total.totalAvgMass}</TFThFoot>
										<TFThFoot>{total.totalPrice}</TFThFoot>
										<TFThFoot />
										<TFThFoot />
										<TFThFoot />
										{!!userAndOrgInfo?.trackingCategoryAFiltered?.categories.length && <TFThFoot />}
										{!!userAndOrgInfo?.trackingCategoryBFiltered?.categories.length && <TFThFoot />}
										<TFThFoot />
										<TFThFoot>{total.total}</TFThFoot>
										<TFThFoot isActions />
									</TFTr>
								</TFTfoot>
							</>
						) : (
							<TFTbody>
								<TFTr>
									<TFTd isEmpty colSpan={10}>
										No data available
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>

			<TFAddRow>
				{!!quote?.lines && (
					<Button
						type="button"
						disabled={disabled}
						isSecondary
						onClick={() =>
							replace(
								quote.lines.map(
									(line): MeatOrderLineType => ({
										product: line.product as ProductType,
										comment: line.comment || "",
										quantity: line.quantity,
										mass: line.mass || "",
										account: line.account,
										unitPrice: line.unitPrice,
										discount: line.discount,
										taxType: line.taxRate as TaxRateType,
										trackingCategoryA: userAndOrgInfo?.trackingCategoryAFiltered?.categories.find(
											({ id }) => id === line.trackingCategoryAId,
										),
										trackingCategoryB: userAndOrgInfo?.trackingCategoryBFiltered?.categories.find(
											({ id }) => id === line.trackingCategoryBId,
										),
										total: calculateTotal(+line.unitPrice, +line.quantity, +line.discount).total,
									}),
								),
							)
						}
					>
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#copy" />
						</svg>
						Copy from Quote
					</Button>
				)}
				<Button
					type="button"
					disabled={disabled}
					isSecondary
					onClick={() => append({ ...EmptyMeatOrderLine })}
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
