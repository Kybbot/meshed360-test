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

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import {
	FormTableAccountSelect,
	FormTableProductSelect,
	FormTableTaxRatesSelect,
} from "@/components/widgets/Selects";

import { ProductType } from "@/@types/products";
import { MeatOrderFormValues } from "@/@types/salesOrders/local.ts";
import { GetAllAccountsResponseType, TaxRateType } from "@/@types/selects.ts";
import { TFTd, TFTr } from "@/components/widgets/Table";
import { ApiResult } from "@/@types/api.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";
import { ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<MeatOrderFormValues>;
	control: Control<MeatOrderFormValues, unknown>;
	register: UseFormRegister<MeatOrderFormValues>;
	setValue: UseFormSetValue<MeatOrderFormValues>;
	priceListContentData: Record<string, number> | null;
	disabled: boolean;
	orderInfo: ExtendedSalesOrder;
};

export const OrderServicesRow: FC<Props> = ({
	index,
	errors,
	control,
	remove,
	register,
	setValue,
	priceListContentData,
	disabled,
	orderInfo,
}) => {
	const allValues = useWatch({
		name: "serviceLines",
		control,
	});
	const queryClient = useQueryClient();
	const { orgId } = useStore(orgStore);

	const currentValues = allValues[index];
	const { quantity, unitPrice, discount } = currentValues;

	const { total, totalErrorMesssage } = calculateTotal(+unitPrice, +quantity, +discount);

	useEffect(() => {
		if (total) {
			setValue(`serviceLines.${index}.total`, total);
		}
	}, [index, total, setValue]);

	const onProductChange = (value: ProductType) => {
		if (priceListContentData?.[value.id]) {
			setValue(`serviceLines.${index}.unitPrice`, priceListContentData[value.id]?.toString());
		} else {
			setValue(`serviceLines.${index}.unitPrice`, "0");
		}
		if (value.salesTax) {
			setValue(`serviceLines.${index}.taxType`, value.salesTax);
		} else {
			setValue(`serviceLines.${index}.taxType`, orderInfo.taxRate as TaxRateType);
		}

		setValue(`serviceLines.${index}.discount`, orderInfo.customer.discount ?? "");

		if (value.serviceAccountMappings?.revenueAccount) {
			const defaultAccount = queryClient
				.getQueryData<ApiResult<GetAllAccountsResponseType>>(["get-select-accounts", orgId, ""])
				?.data.find(({ id }) => id === value.serviceAccountMappings.revenueAccount);

			if (defaultAccount) {
				setValue(`serviceLines.${index}.account`, defaultAccount);
			} else {
				setValue(`serviceLines.${index}.account`, orderInfo.account);
			}
		} else {
			setValue(`serviceLines.${index}.account`, orderInfo.account);
		}
	};

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
							onProductChange(value);
						},
					}}
					render={({ field }) => (
						<FormTableProductSelect
							{...field}
							type="service"
							value={field.value as ProductType}
							id="serviceLinesproductId"
							onValueChange={field.onChange}
							error={errors?.serviceLines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<MeatOrderFormValues>
					type="text"
					label="Comment"
					register={register}
					id="serviceLinescommentId"
					name={`serviceLines.${index}.comment`}
					error={errors?.serviceLines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<MeatOrderFormValues>
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
					id="serviceLinesquantityId"
					name={`serviceLines.${index}.quantity`}
					error={errors?.serviceLines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<MeatOrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Unit Price"
					register={register}
					rules={{
						min: 0,
						required: "Required",
					}}
					id="serviceLinesunitPriceId"
					name={`serviceLines.${index}.unitPrice`}
					error={errors?.serviceLines?.[index]?.unitPrice?.message || totalErrorMesssage}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<MeatOrderFormValues>
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
					id="serviceLinesdiscountId"
					name={`serviceLines.${index}.discount`}
					error={errors?.serviceLines?.[index]?.discount?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					name={`serviceLines.${index}.taxType`}
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableTaxRatesSelect
							{...field}
							value={field.value as TaxRateType}
							id="serviceLinesTaxTypeId"
							type="sales"
							onValueChange={field.onChange}
							error={errors?.serviceLines?.[index]?.taxType?.message}
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
							id="orderLinesAccountId"
							type="salesRevenueAccount"
							onValueChange={field.onChange}
							error={errors?.serviceLines?.[index]?.account?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd isRight>{total}</TFTd>
			<TFTd>
				<button
					disabled={disabled}
					type="button"
					aria-label="Remove row"
					className="formTable__remove"
					onClick={() => remove(index)}
				>
					<svg focusable="false" aria-hidden="true" width="16" height="16">
						<use xlinkHref="/icons/icons.svg#crossInCircle" />
					</svg>
				</button>
			</TFTd>
		</TFTr>
	);
};
