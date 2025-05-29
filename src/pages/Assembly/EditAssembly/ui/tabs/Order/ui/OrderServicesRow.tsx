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

import { calculateTotal } from "../utils/calculate";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableExpenseAccountSelect, FormTableProductSelect } from "@/components/widgets/Selects";

import { orgStore } from "@/app/stores/orgStore";

import { ApiResult } from "@/@types/api";
import { AssemblyFormValues } from "@/@types/assembly/assembly";
import { GetProductSettingsResponseType, ProductType } from "@/@types/products";

type Props = {
	index: number;
	disabledStatus: boolean;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<AssemblyFormValues>;
	control: Control<AssemblyFormValues, unknown>;
	register: UseFormRegister<AssemblyFormValues>;
	setValue: UseFormSetValue<AssemblyFormValues>;
};

export const OrderServicesRow: FC<Props> = ({
	index,
	errors,
	control,
	disabledStatus,
	remove,
	register,
	setValue,
}) => {
	const { orgId } = useStore(orgStore);
	const queryClient = useQueryClient();

	const disableField = disabledStatus;

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
					name={`serviceLines.${index}.product`}
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
							disabled={disableField}
							id="serviceLinesProductId"
							onValueChange={field.onChange}
							error={errors?.serviceLines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<AssemblyFormValues>
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
					disabled={disableField}
					id="serviceLinesQuantityId"
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
							disabled={disableField}
							id="serviceLinesAccountId"
							onValueChange={field.onChange}
							error={errors?.serviceLines?.[index]?.expenseAccount?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<AssemblyFormValues>
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
					disabled={disableField}
					id="serviceLinesUnitCostId"
					name={`serviceLines.${index}.unitCost`}
					error={errors?.serviceLines?.[index]?.unitCost?.message}
				/>
			</TFTd>
			<TFTd isRight>{total}</TFTd>
			<TFTd>{!disableField && <TFRemove onClick={() => remove(index)} />}</TFTd>
		</TFTr>
	);
};
