import { FC, useEffect, useMemo, useRef } from "react";

import {
	Control,
	Controller,
	FieldArrayWithId,
	FieldErrors,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { ProductSelect } from "./ProductSelect";

import { calculateTotal } from "../utils/calculate";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect";

import {
	FormTableAccountSelect,
	FormTableProductSelect,
	FormTableTaxRatesSelect,
} from "@/components/widgets/Selects";
import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import {
	BillStatus,
	BillFormValues,
	DefaultBillLine,
	GetAllBillsResponseType,
} from "@/@types/purchaseOrders";
import { ProductType } from "@/@types/products";
import { GetOrderLineType, GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

type Props = {
	index: number;
	orderLinesObj: {
		[key: string]: number;
	};
	disabledStatus: boolean;
	remove: UseFieldArrayRemove;
	data: GetAllBillsResponseType;
	currentBillStatus?: BillStatus;
	errors: FieldErrors<BillFormValues>;
	currentOrderLines?: GetOrderLineType[];
	control: Control<BillFormValues, unknown>;
	register: UseFormRegister<BillFormValues>;
	setValue: UseFormSetValue<BillFormValues>;
	orderData: GetPurchaseOrderByIdResponseType;
	update: UseFieldArrayUpdate<BillFormValues, "lines">;
	fields: FieldArrayWithId<BillFormValues, "lines", "id">[];
};

export const BillLinesRow: FC<Props> = ({
	data,
	index,
	fields,
	errors,
	control,
	orderData,
	orderLinesObj,
	disabledStatus,
	currentOrderLines,
	currentBillStatus,
	remove,
	update,
	register,
	setValue,
}) => {
	const firstRender = useRef(true);

	const taxRule = orderData.taxRule;
	const supplier = orderData.supplier;
	const blindBill = orderData.blindBill;
	const billFirst = orderData.billFirst;
	const taxInclusive = orderData.taxInclusive;
	const inventoryAccount = orderData.inventoryAccount;
	const disableField = disabledStatus || (!billFirst && !currentOrderLines);

	const userAndOrgInfo = useGetUserAndOrgInfo();

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const filedId = fields[index].id;
	const currentValues = allValues[index];

	const { lineId, orderLineId, product, supplierSku, quantity, unitPrice, discount, taxRate } = currentValues;

	const { finalQuantity, maxQuantity } = useMemo(() => {
		if (!orderLineId)
			return {
				finalQuantity: 0,
				maxQuantity: 0,
			};

		const billFirst = orderData.billFirst;
		const blindBill = orderData.blindBill;

		if (billFirst && blindBill) {
			return {
				finalQuantity: 0,
				maxQuantity: 0,
			};
		}

		if (orderLineId || (!blindBill && !billFirst)) {
			const orderLineQuantity = billFirst
				? orderData.orderLines.find((line) => line.id === orderLineId)?.quantity
				: currentOrderLines
					? currentOrderLines.find((line) => line.id === orderLineId)?.quantity
					: 0;

			const billsQuantity = data.bills.reduce((acc, bill) => {
				const linesQuantity =
					bill.status === "AUTHORIZED" || bill.status === "COMPLETED"
						? bill.lines.reduce((acc, line) => {
								return acc + (line.orderLineId === orderLineId ? +line.quantity : 0);
							}, 0)
						: 0;

				return acc + linesQuantity || 0;
			}, 0);

			const finalQuantity = Math.max(+(orderLineQuantity || 0) - billsQuantity, 0);

			const maxQuantity =
				currentBillStatus === "AUTHORIZED"
					? finalQuantity
					: Math.max(finalQuantity - orderLinesObj[orderLineId], 0);

			return {
				finalQuantity,
				maxQuantity,
			};
		}

		return {
			finalQuantity: 0,
			maxQuantity: 0,
		};
	}, [data, orderData, orderLineId, orderLinesObj, currentBillStatus, currentOrderLines]);

	const { total, totalErrorMesssage } = calculateTotal(
		+unitPrice,
		+quantity,
		+discount,
		taxInclusive,
		taxRate,
	);

	useEffect(() => {
		if (total) {
			setValue(`lines.${index}.total`, total);
		}
	}, [index, total, setValue]);

	useEffect(() => {
		if (!lineId && filedId && firstRender.current) {
			setValue(`lines.${index}.lineId`, filedId);
			firstRender.current = false;
		}
	}, [lineId, filedId, index, setValue]);

	useEffect(() => {
		if (product && !quantity && maxQuantity >= 0) {
			setValue(`lines.${index}.quantity`, maxQuantity.toString());
		}
	}, [index, product, quantity, maxQuantity, setValue]);

	return (
		<TFTr>
			<TFTd>
				{!blindBill || (blindBill && !billFirst) ? (
					<Controller
						control={control}
						name={`lines.${index}.product`}
						rules={{
							required: "Required",
							onChange(event) {
								const value = event.target.value as GetOrderLineType;
								const currentDiscount = blindBill && !billFirst ? supplier.discount || "" : value.discount;

								setValue(`lines.${index}.orderLineId`, value.id);
								setValue(`lines.${index}.comment`, value.comment);
								setValue(`lines.${index}.supplierSku`, value.supplierSku);
								setValue(`lines.${index}.unitPrice`, value.unitPrice);
								setValue(`lines.${index}.discount`, currentDiscount);
								setValue(`lines.${index}.taxRate`, value.taxType || taxRule);
								setValue(`lines.${index}.account`, inventoryAccount);
								setValue(`lines.${index}.trackingCategory1`, value.trackingCategory1);
								setValue(`lines.${index}.trackingCategory2`, value.trackingCategory2);
								setValue(`lines.${index}.receivingIds`, value.receivingIds);
							},
						}}
						render={({ field }) => (
							<ProductSelect
								{...field}
								value={field.value}
								disabled={disableField}
								id="orderLinesproductId"
								finalQuantity={finalQuantity}
								onValueChange={field.onChange}
								error={errors?.lines?.[index]?.product?.message}
								customValues={!billFirst ? currentOrderLines : orderData.orderLines}
							/>
						)}
					/>
				) : (
					<Controller
						control={control}
						name={`lines.${index}.blindProduct`}
						rules={{
							required: "Required",
							onChange(event) {
								const value = event.target.value as ProductType;

								setValue(`lines.${index}.supplierSku`, value.supplierSku);
								setValue(`lines.${index}.unitPrice`, value.productCost.toString());
								setValue(`lines.${index}.discount`, supplier.discount || "");
								setValue(`lines.${index}.taxRate`, taxRule || value.purchaseTax);
								setValue(`lines.${index}.account`, inventoryAccount);
							},
						}}
						render={({ field }) => (
							<FormTableProductSelect
								{...field}
								type="stock"
								value={field.value}
								id="orderLinesproductId"
								disabled={disableField}
								onValueChange={field.onChange}
								error={errors?.lines?.[index]?.blindProduct?.message}
							/>
						)}
					/>
				)}
			</TFTd>
			<TFTd>
				<TableInputRhf<BillFormValues>
					type="text"
					label="Comment"
					register={register}
					disabled={disableField}
					id="orderLinescommentId"
					name={`lines.${index}.comment`}
					error={errors?.lines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd isText>{supplierSku}</TFTd>
			<TFTd>
				{!blindBill || (blindBill && !billFirst) ? (
					<TableInputRhf<BillFormValues>
						min={0}
						step={0.01}
						type="number"
						label="Quantity"
						register={register}
						rules={{
							required: "Required",
							min: { value: 1, message: "Min is 1" },
							max: {
								value: +quantity + maxQuantity,
								message: `Max quantity is ${+quantity + maxQuantity}`,
							},
							onChange(event) {
								const value = +event.target.value as number;

								if (value < 0) {
									setValue(`lines.${index}.quantity`, "0");
								}
								if (value > +quantity + maxQuantity) {
									setValue(`lines.${index}.quantity`, (+quantity + maxQuantity).toString());
								}
							},
						}}
						disabled={disableField}
						id="orderLinesquantityId"
						name={`lines.${index}.quantity`}
						error={errors?.lines?.[index]?.quantity?.message}
					/>
				) : (
					<TableInputRhf<BillFormValues>
						min={0}
						step={0.01}
						type="number"
						label="Quantity"
						register={register}
						disabled={disableField}
						rules={{
							required: "Required",
							min: { value: 1, message: "Min is 1" },
							onChange(event) {
								const value = +event.target.value;

								if (value < 0) {
									setValue(`lines.${index}.quantity`, "0");
								}
							},
						}}
						id="orderLinesquantityId"
						name={`lines.${index}.quantity`}
						error={errors?.lines?.[index]?.quantity?.message}
					/>
				)}
			</TFTd>
			<TFTd isText>{currentBillStatus !== "VOID" ? maxQuantity || 0 : ""}</TFTd>
			<TFTd>
				<TableInputRhf<BillFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Price"
					register={register}
					rules={{
						min: 0,
						required: "Required",
					}}
					disabled={disableField}
					id="orderLinesunitPriceId"
					name={`lines.${index}.unitPrice`}
					error={errors?.lines?.[index]?.unitPrice?.message || totalErrorMesssage}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<BillFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Discount"
					register={register}
					rules={{
						min: 0,
						max: 100,
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0 || value > 100) {
								setValue(`lines.${index}.discount`, "0");
							}
						},
					}}
					disabled={disableField}
					id="orderLinesdiscountId"
					name={`lines.${index}.discount`}
					error={errors?.lines?.[index]?.discount?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.taxRate`}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableTaxRatesSelect
							{...field}
							type="purchase"
							value={field.value}
							disabled={disableField}
							id="orderLinesTaxRateId"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.taxRate?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.account`}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableAccountSelect
							{...field}
							value={field.value}
							type="expenseAccounts"
							disabled={disableField}
							id="orderLinesAccountId"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.account?.message}
						/>
					)}
				/>
			</TFTd>
			{userAndOrgInfo?.trackingCategoryA && (
				<TFTd>
					<Controller
						control={control}
						name={`lines.${index}.trackingCategory1`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={disableField}
								onValueChange={field.onChange}
								id="additionalLinesTrackingCategoryAId"
								customValues={userAndOrgInfo.trackingCategoryA?.categories}
								error={errors?.lines?.[index]?.trackingCategory1?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			{userAndOrgInfo?.trackingCategoryB && (
				<TFTd>
					<Controller
						control={control}
						name={`lines.${index}.trackingCategory2`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={disableField}
								onValueChange={field.onChange}
								id="additionalLinesTrackingCategoryBId"
								customValues={userAndOrgInfo.trackingCategoryB?.categories}
								error={errors?.lines?.[index]?.trackingCategory2?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			<TFTd isRight>{total}</TFTd>
			<TFTd>
				{!disableField && (
					<TFRemove
						onClick={() => {
							if (fields.length === 1 && index === 0) {
								update(index, DefaultBillLine);
							} else {
								remove(index);
							}
						}}
					/>
				)}
			</TFTd>
		</TFTr>
	);
};
