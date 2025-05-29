import { FC, useEffect } from "react";
import {
	Control,
	Controller,
	FieldErrors,
	UseFieldArrayRemove,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { calculateTotal } from "../utils/calculate";

import { SwitchRhf } from "@/components/shared/form/SwitchRhf";
import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableProductSelectWithInput, FormTableTaxRatesSelect } from "@/components/widgets/Selects";

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { OrderLinesFormValues } from "@/@types/purchaseOrder/orderLines";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<OrderLinesFormValues>;
	lineStatus: "DRAFT" | "NEW" | "AUTHORISED";
	orderData: GetPurchaseOrderByIdResponseType;
	control: Control<OrderLinesFormValues, unknown>;
	register: UseFormRegister<OrderLinesFormValues>;
	setValue: UseFormSetValue<OrderLinesFormValues>;
};

export const OrderCostsRow: FC<Props> = ({
	index,
	errors,
	control,
	orderData,
	lineStatus,
	remove,
	register,
	setValue,
}) => {
	const taxRule = orderData.taxRule;
	const taxInclusive = orderData.taxInclusive;

	const disableField = lineStatus === "AUTHORISED";

	const userAndOrgInfo = useGetUserAndOrgInfo();

	const allValues = useWatch({
		name: "additionalLines",
		control,
	});

	const currentValues = allValues[index];
	const { quantity, unitPrice, discount, taxType } = currentValues;

	const { total, totalErrorMesssage } = calculateTotal(
		+unitPrice,
		+quantity,
		+discount,
		taxInclusive,
		taxType,
	);

	useEffect(() => {
		if (total) {
			setValue(`additionalLines.${index}.total`, total);
		}
	}, [index, total, setValue]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					name={`additionalLines.${index}.product`}
					control={control}
					rules={{
						required: "Required",
						onChange() {
							setValue(`additionalLines.${index}.unitPrice`, "0");
							setValue(`additionalLines.${index}.taxType`, taxRule);
						},
					}}
					render={({ field }) => (
						<FormTableProductSelectWithInput
							{...field}
							type="service"
							value={field.value}
							disabled={disableField}
							id="additionalLinesproductId"
							onValueChange={field.onChange}
							error={errors?.additionalLines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderLinesFormValues>
					type="text"
					label="Reference"
					register={register}
					disabled={disableField}
					id="additionalLinesReferenceId"
					name={`additionalLines.${index}.reference`}
					error={errors?.additionalLines?.[index]?.reference?.message}
				/>
			</TFTd>
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
								setValue(`additionalLines.${index}.quantity`, "0");
							}
						},
					}}
					disabled={disableField}
					id="additionalLinesquantityId"
					name={`additionalLines.${index}.quantity`}
					error={errors?.additionalLines?.[index]?.quantity?.message}
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
					id="additionalLinesunitPriceId"
					name={`additionalLines.${index}.unitPrice`}
					error={errors?.additionalLines?.[index]?.unitPrice?.message || totalErrorMesssage}
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
								setValue(`additionalLines.${index}.discount`, "0");
							}
						},
					}}
					disabled={disableField}
					id="additionalLinesdiscountId"
					name={`additionalLines.${index}.discount`}
					error={errors?.additionalLines?.[index]?.discount?.message}
				/>
			</TFTd>
			<TFTd isCenter>
				<SwitchRhf<OrderLinesFormValues>
					hideLabel
					register={register}
					disabled={disableField}
					label="Add To Landed Cost"
					id="additionalLinesAddToLandedCostId"
					name={`additionalLines.${index}.addToLandedCost`}
					error={errors?.additionalLines?.[index]?.addToLandedCost?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					name={`additionalLines.${index}.taxType`}
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableTaxRatesSelect
							{...field}
							type="purchase"
							value={field.value}
							disabled={disableField}
							id="additionalLinesTaxTypeId"
							onValueChange={field.onChange}
							error={errors?.additionalLines?.[index]?.taxType?.message}
						/>
					)}
				/>
			</TFTd>
			{userAndOrgInfo?.trackingCategoryA && (
				<TFTd>
					<Controller
						control={control}
						name={`additionalLines.${index}.trackingCategory1`}
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
								error={errors?.additionalLines?.[index]?.trackingCategory1?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			{userAndOrgInfo?.trackingCategoryB && (
				<TFTd>
					<Controller
						control={control}
						name={`additionalLines.${index}.trackingCategory2`}
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
								error={errors?.additionalLines?.[index]?.trackingCategory2?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			<TFTd isRight>{total}</TFTd>
			<TFTd>{!disableField && <TFRemove onClick={() => remove(index)} />}</TFTd>
		</TFTr>
	);
};
