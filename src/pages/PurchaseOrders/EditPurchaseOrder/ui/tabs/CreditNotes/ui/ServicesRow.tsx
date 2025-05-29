import { FC, useEffect } from "react";
import {
	Control,
	useWatch,
	Controller,
	FieldErrors,
	UseFormSetValue,
	UseFormRegister,
	UseFieldArrayRemove,
} from "react-hook-form";

import { calculateTotal } from "../utils/calculate";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import {
	FormTableAccountSelect,
	FormTableTaxRatesSelect,
	FormTableProductSelectWithInput,
} from "@/components/widgets/Selects";
import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";

import { CreditNoteFormValues } from "@/@types/purchaseOrder/creditNote";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

type Props = {
	index: number;
	disabledServices: boolean;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<CreditNoteFormValues>;
	orderData: GetPurchaseOrderByIdResponseType;
	control: Control<CreditNoteFormValues, unknown>;
	register: UseFormRegister<CreditNoteFormValues>;
	setValue: UseFormSetValue<CreditNoteFormValues>;
};

export const ServicesRow: FC<Props> = ({
	index,
	errors,
	control,
	orderData,
	disabledServices,
	remove,
	register,
	setValue,
}) => {
	const disableField = disabledServices;

	const taxRule = orderData.taxRule;
	const taxInclusive = orderData.taxInclusive;
	const inventoryAccount = orderData.inventoryAccount;

	const allValues = useWatch({
		name: "serviceLines",
		control,
	});

	const currentValues = allValues[index];
	const { quantity, unitPrice, discount, tax } = currentValues;

	const { total, totalErrorMesssage } = calculateTotal(+unitPrice, +quantity, +discount, taxInclusive, tax);

	useEffect(() => {
		if (total) {
			setValue(`serviceLines.${index}.total`, total);
		}
	}, [index, total, setValue]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					name={`serviceLines.${index}.product`}
					control={control}
					rules={{
						required: "Required",
						onChange() {
							setValue(`serviceLines.${index}.tax`, taxRule);
							setValue(`serviceLines.${index}.unitPrice`, "0");
							setValue(`serviceLines.${index}.account`, inventoryAccount);
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
							error={errors?.serviceLines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<CreditNoteFormValues>
					type="text"
					label="Comment"
					register={register}
					disabled={disableField}
					id="additionalLinesReferenceId"
					name={`serviceLines.${index}.comment`}
					error={errors?.serviceLines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<CreditNoteFormValues>
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
								setValue(`serviceLines.${index}.quantity`, "0");
							}
						},
					}}
					disabled={disableField}
					id="additionalLinesquantityId"
					name={`serviceLines.${index}.quantity`}
					error={errors?.serviceLines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<CreditNoteFormValues>
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
					name={`serviceLines.${index}.unitPrice`}
					error={errors?.serviceLines?.[index]?.unitPrice?.message || totalErrorMesssage}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<CreditNoteFormValues>
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
								setValue(`serviceLines.${index}.discount`, "0");
							}
						},
					}}
					disabled={disableField}
					id="additionalLinesdiscountId"
					name={`serviceLines.${index}.discount`}
					error={errors?.serviceLines?.[index]?.discount?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					name={`serviceLines.${index}.tax`}
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
							error={errors?.serviceLines?.[index]?.tax?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					name={`serviceLines.${index}.account`}
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
							error={errors?.serviceLines?.[index]?.account?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd isRight>{total}</TFTd>
			<TFTd>{!disableField && <TFRemove onClick={() => remove(index)} />}</TFTd>
		</TFTr>
	);
};
