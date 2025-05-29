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

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableAccountSelect, FormTableTaxRatesSelect } from "@/components/widgets/Selects";

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { BillStatus, BillFormValues, DefaultBillLine } from "@/@types/purchaseOrders";
import { GetOrderLineType, GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

type Props = {
	index: number;
	orderLinesObj: {
		[key: string]: number;
	};
	disabledStatus: boolean;
	remove: UseFieldArrayRemove;
	currentBillStatus?: BillStatus;
	errors: FieldErrors<BillFormValues>;
	currentOrderLines?: GetOrderLineType[];
	control: Control<BillFormValues, unknown>;
	register: UseFormRegister<BillFormValues>;
	setValue: UseFormSetValue<BillFormValues>;
	orderData: GetPurchaseOrderByIdResponseType;
	update: UseFieldArrayUpdate<BillFormValues, "lines">;
	receivingLinesQuantity: Record<string, number> | null;
	fields: FieldArrayWithId<BillFormValues, "lines", "id">[];
};

export const SubBillLinesRow: FC<Props> = ({
	index,
	fields,
	errors,
	control,
	orderData,
	orderLinesObj,
	disabledStatus,
	currentOrderLines,
	currentBillStatus,
	receivingLinesQuantity,
	remove,
	update,
	register,
	setValue,
}) => {
	const firstRender = useRef(true);

	const taxInclusive = orderData.taxInclusive;
	const inventoryAccount = orderData.inventoryAccount;
	const disableField = disabledStatus || !currentOrderLines;

	const userAndOrgInfo = useGetUserAndOrgInfo();

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const filedId = fields[index].id;
	const currentValues = allValues[index];

	const { lineId, orderLineId, supplierSku, quantity, unitPrice, discount, taxRate } = currentValues;

	const { maxQuantity, finalQuantity } = useMemo(() => {
		if (orderLineId) {
			const finalQuantity = receivingLinesQuantity?.[orderLineId] || 0;

			const maxQuantity =
				currentBillStatus === "AUTHORIZED"
					? finalQuantity
					: Math.max(finalQuantity - orderLinesObj[orderLineId], 0);

			return { maxQuantity, finalQuantity };
		}

		return { maxQuantity: 0, finalQuantity: 0 };
	}, [orderLineId, orderLinesObj, currentBillStatus, receivingLinesQuantity]);

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

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.product`}
					rules={{
						required: "Required",
						onChange(event) {
							const value = event.target.value as GetOrderLineType;
							const quantity = Math.max(+value.quantity - (orderLinesObj?.[value.id] || 0), 0).toString();

							setValue(`lines.${index}.orderLineId`, value.id);
							setValue(`lines.${index}.comment`, value.comment);
							setValue(`lines.${index}.supplierSku`, value.supplierSku);
							setValue(`lines.${index}.unitPrice`, value.unitPrice);
							setValue(`lines.${index}.quantity`, quantity);
							setValue(`lines.${index}.discount`, value.discount);
							setValue(`lines.${index}.taxRate`, value.taxType);
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
							customValues={currentOrderLines}
							error={errors?.lines?.[index]?.product?.message}
						/>
					)}
				/>
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
