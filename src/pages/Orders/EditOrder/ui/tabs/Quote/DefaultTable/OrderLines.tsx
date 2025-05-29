import { FC } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { OrderLinesRow } from "./OrderLinesRow";

import { calculateFooterValues, calculateTotal } from "../utils/calculate";

import { Button } from "@/components/shared/Button";

import {
	EmptyDefaultOrderLine,
	DefaultOrderFormValues,
	DefaultOrderLineType,
} from "@/@types/salesOrders/local.ts";
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
	errors: FieldErrors<DefaultOrderFormValues>;
	control: Control<DefaultOrderFormValues, unknown>;
	register: UseFormRegister<DefaultOrderFormValues>;
	setValue: UseFormSetValue<DefaultOrderFormValues>;
	priceListContentData: Record<string, number> | null;
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
	disabled,
	quote,
	orderInfo,
}) => {
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const { update, remove, append, replace, fields } = useFieldArray({
		name: "lines",
		control,
	});

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const { totalQuantity, totalPrice, total } = calculateFooterValues(allValues);

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
								<TFTh>Price</TFTh>
								<TFTh>Discount %</TFTh>
								<TFTh style={{ minWidth: "140px" }}>Tax</TFTh>
								<TFTh>Margin</TFTh>
								{!!userAndOrgInfo?.trackingCategoryAFiltered?.categories.length && (
									<TFTh style={{ minWidth: "140px" }}>{userAndOrgInfo.trackingCategoryAFiltered.name}</TFTh>
								)}
								{!!userAndOrgInfo?.trackingCategoryBFiltered?.categories.length && (
									<TFTh style={{ minWidth: "140px" }}>{userAndOrgInfo.trackingCategoryBFiltered.name}</TFTh>
								)}
								<TFTh style={{ minWidth: "140px" }}>Account</TFTh>
								<TFTh isRight>Total</TFTh>
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
										{!!userAndOrgInfo?.trackingCategoryAFiltered?.categories.length && <TFThFoot />}
										{!!userAndOrgInfo?.trackingCategoryBFiltered?.categories.length && <TFThFoot />}
										<TFThFoot />
										<TFThFoot isRight>{total}</TFThFoot>
										<TFThFoot isActions />
									</TFTr>
								</TFTfoot>
							</>
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
				{!!quote?.lines && (
					<Button
						type="button"
						disabled={disabled}
						isSecondary
						onClick={() =>
							replace(
								quote.lines.map(
									(line): DefaultOrderLineType => ({
										product: line.product as ProductType,
										comment: line.comment || "",
										quantity: line.quantity,
										unitPrice: line.unitPrice,
										discount: line.discount,
										taxType: line.taxRate as TaxRateType,
										account: line.account,
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
					onClick={() => append({ ...EmptyDefaultOrderLine })}
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
