import { FC } from "react";
import {
	Control,
	useWatch,
	Controller,
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
	UseFieldArrayRemove,
} from "react-hook-form";
import { useStore } from "zustand";
import { useQueryClient } from "@tanstack/react-query";

import { calculateTotal } from "../../../utils/calculate";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableExpenseAccountSelect, FormTableProductSelect } from "@/components/widgets/Selects";

import { orgStore } from "@/app/stores/orgStore";

import { ApiResult } from "@/@types/api";
import { GetProductSettingsResponseType, ProductBomFormValues, ProductType } from "@/@types/products";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<ProductBomFormValues>;
	control: Control<ProductBomFormValues, unknown>;
	register: UseFormRegister<ProductBomFormValues>;
	setValue: UseFormSetValue<ProductBomFormValues>;
};

export const ProductBomServiceLinesRow: FC<Props> = ({
	index,
	errors,
	control,
	remove,
	register,
	setValue,
}) => {
	const { orgId } = useStore(orgStore);
	const queryClient = useQueryClient();

	const allValues = useWatch({
		name: "serviceLines",
		control,
	});

	const currentValues = allValues[index];
	const { unitCost, quantity } = currentValues;

	const { total } = calculateTotal(+unitCost, +quantity);

	return (
		<TFTr>
			<TFTd>
				<Controller
					name={`serviceLines.${index}.service`}
					control={control}
					rules={{
						required: "Required",
						onChange(event) {
							const value = event.target.value as ProductType;

							if (value.serviceAccountMappings.expenseAccount) {
								const accounts = queryClient.getQueryData<ApiResult<GetProductSettingsResponseType>>([
									"get-select-expense-accounts",
									orgId,
								]);

								if (accounts && accounts.data.expenseAccounts.length > 0) {
									const account = accounts.data.expenseAccounts.find(
										(item) => item.id === value.serviceAccountMappings.expenseAccount,
									);

									if (account) {
										setValue(`serviceLines.${index}.expenseAccount`, account);
									}
								}
							}
						},
					}}
					render={({ field }) => (
						<FormTableProductSelect
							{...field}
							type="service"
							value={field.value}
							id={`serviceLinesProductId-${index}`}
							onValueChange={field.onChange}
							error={errors?.serviceLines?.[index]?.service?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<ProductBomFormValues>
					step={0.01}
					type="number"
					label="Quantity"
					register={register}
					rules={{
						min: 0,
						required: "Required",
						onChange(event) {
							const value = +event.target.value;
							if (value < 0) {
								setValue(`serviceLines.${index}.quantity`, "0");
							}
						},
					}}
					id={`serviceLinesQuantityId-${index}`}
					name={`serviceLines.${index}.quantity`}
					error={errors?.serviceLines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					name={`serviceLines.${index}.expenseAccount`}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableExpenseAccountSelect
							{...field}
							value={field.value}
							id={`serviceLinesAccountId-${index}`}
							onValueChange={field.onChange}
							error={errors?.serviceLines?.[index]?.expenseAccount?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<ProductBomFormValues>
					step={0.01}
					type="number"
					label="Unit Cost"
					register={register}
					rules={{
						min: 0,
						required: "Required",
						onChange(event) {
							const value = +event.target.value;
							if (value < 0) {
								setValue(`serviceLines.${index}.unitCost`, "0");
							}
						},
					}}
					id={`serviceLinesUnitCostId-${index}`}
					name={`serviceLines.${index}.unitCost`}
					error={errors?.serviceLines?.[index]?.unitCost?.message}
				/>
			</TFTd>
			<TFTd isRight>{total}</TFTd>
			<TFTd>
				<TFRemove onClick={() => remove(index)} />
			</TFTd>
		</TFTr>
	);
};
