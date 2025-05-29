import { FC, useEffect } from "react";

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

import { calculateTotal } from "../utils/calculate";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableProductSelect, FormTableTaxRatesSelect } from "@/components/widgets/Selects";

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { ProductType } from "@/@types/products";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { DefaultOrderLine, OrderLinesFormValues } from "@/@types/purchaseOrder/orderLines";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<OrderLinesFormValues>;
	lineStatus: "DRAFT" | "NEW" | "AUTHORISED";
	orderData: GetPurchaseOrderByIdResponseType;
	control: Control<OrderLinesFormValues, unknown>;
	register: UseFormRegister<OrderLinesFormValues>;
	setValue: UseFormSetValue<OrderLinesFormValues>;
	update: UseFieldArrayUpdate<OrderLinesFormValues, "orderLines">;
	fields: FieldArrayWithId<OrderLinesFormValues, "orderLines", "id">[];
};

export const OrderLinesRow: FC<Props> = ({
	index,
	fields,
	errors,
	control,
	orderData,
	lineStatus,
	remove,
	update,
	register,
	setValue,
}) => {
	const taxRule = orderData.taxRule;
	const supplier = orderData.supplier;
	const taxInclusive = orderData.taxInclusive;

	const disableField = lineStatus === "AUTHORISED";

	const userAndOrgInfo = useGetUserAndOrgInfo();

	const allValues = useWatch({
		name: "orderLines",
		control,
	});

	const currentValues = allValues[index];
	const { quantity, unitPrice, discount, taxType, supplierSku, unitOfMeasure } = currentValues;

	const { total, totalErrorMesssage } = calculateTotal(
		+unitPrice,
		+quantity,
		+discount,
		taxInclusive,
		taxType,
	);

	useEffect(() => {
		if (total) {
			setValue(`orderLines.${index}.total`, total);
		}
	}, [index, total, setValue]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`orderLines.${index}.product`}
					rules={{
						required: "Required",
						onChange(event) {
							const value = event.target.value as ProductType;

							setValue(`orderLines.${index}.taxType`, taxRule || value.purchaseTax);
							setValue(`orderLines.${index}.supplierSku`, value.supplierSku);
							setValue(`orderLines.${index}.unitOfMeasure`, value.unitOfMeasure);
							setValue(`orderLines.${index}.unitPrice`, value.productCost.toString());
							setValue(`orderLines.${index}.discount`, supplier.discount || "");
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
							error={errors?.orderLines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderLinesFormValues>
					type="text"
					label="Comment"
					register={register}
					disabled={disableField}
					id="orderLinescommentId"
					name={`orderLines.${index}.comment`}
					error={errors?.orderLines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd isText>{supplierSku}</TFTd>
			<TFTd isText>{unitOfMeasure?.name || ""}</TFTd>
			<TFTd>
				<TableInputRhf<OrderLinesFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Quantity"
					register={register}
					rules={{
						min: 0,
						required: "Required",
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0) {
								setValue(`orderLines.${index}.quantity`, "0");
							}
						},
					}}
					disabled={disableField}
					id="orderLinesquantityId"
					name={`orderLines.${index}.quantity`}
					error={errors?.orderLines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderLinesFormValues>
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
					name={`orderLines.${index}.unitPrice`}
					error={errors?.orderLines?.[index]?.unitPrice?.message || totalErrorMesssage}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderLinesFormValues>
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
								setValue(`orderLines.${index}.discount`, "0");
							}
						},
					}}
					disabled={disableField}
					id="orderLinesdiscountId"
					name={`orderLines.${index}.discount`}
					error={errors?.orderLines?.[index]?.discount?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					name={`orderLines.${index}.taxType`}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableTaxRatesSelect
							{...field}
							type="purchase"
							value={field.value}
							disabled={disableField}
							id="orderLinesTaxTypeId"
							onValueChange={field.onChange}
							error={errors?.orderLines?.[index]?.taxType?.message}
						/>
					)}
				/>
			</TFTd>
			{userAndOrgInfo?.trackingCategoryA && (
				<TFTd>
					<Controller
						control={control}
						name={`orderLines.${index}.trackingCategory1`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={disableField}
								onValueChange={field.onChange}
								id="orderLinesTrackingCategoryAId"
								customValues={userAndOrgInfo.trackingCategoryA?.categories}
								error={errors?.orderLines?.[index]?.trackingCategory1?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			{userAndOrgInfo?.trackingCategoryB && (
				<TFTd>
					<Controller
						control={control}
						name={`orderLines.${index}.trackingCategory2`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={disableField}
								onValueChange={field.onChange}
								id="orderLinesTrackingCategoryBId"
								customValues={userAndOrgInfo.trackingCategoryB?.categories}
								error={errors?.orderLines?.[index]?.trackingCategory2?.message}
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
								update(index, DefaultOrderLine);
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
