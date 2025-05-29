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

import { calculateMargin, calculateTotal } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf.tsx";

import {
	FormTableAccountSelect,
	FormTableProductSelect,
	FormTableTaxRatesSelect,
} from "@/components/widgets/Selects";

import { ProductType } from "@/@types/products.ts";
import { EmptyDefaultOrderLine, OrderFormValues } from "@/@types/salesOrders/local.ts";
import { GetAllAccountsResponseType, TaxRateType } from "@/@types/selects.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { FormTableTrackingCategorySelect } from "@/components/widgets/Selects/ui/FormTableTrackingCategorySelect.tsx";
import { TFTd, TFTr } from "@/components/widgets/Table";
import { ApiResult } from "@/@types/api.ts";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<OrderFormValues>;
	control: Control<OrderFormValues, unknown>;
	register: UseFormRegister<OrderFormValues>;
	setValue: UseFormSetValue<OrderFormValues>;
	priceListContentData: Record<string, number> | null;
	update: UseFieldArrayUpdate<OrderFormValues, "defaultQuoteLines">;
	fields: FieldArrayWithId<OrderFormValues, "defaultQuoteLines", "id">[];
};

export const OrderLinesRow: FC<Props> = ({
	index,
	fields,
	errors,
	control,
	remove,
	update,
	register,
	setValue,
	priceListContentData,
}) => {
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const queryClient = useQueryClient();

	const allValues = useWatch({
		name: "defaultQuoteLines",
		control,
	});

	const skipQuote = useWatch({
		name: "skipQuote",
		control,
	});

	const template = useWatch({
		name: "template",
		control,
	});

	const orderAccount = useWatch({
		name: "account",
		control,
	});

	const orderTax = useWatch({
		name: "taxRate",
		control,
	});

	const customerId = useWatch({
		name: "customer.id",
		control,
	});

	const isRequired = template.id === "DEFAULT" && !skipQuote;

	const currentValues = allValues[index];
	const { quantity, unitPrice, discount, product } = currentValues;

	const { total, totalErrorMesssage } = calculateTotal(+unitPrice, +quantity, +discount);
	const { marginPercentage, marginErrorMesssage, marginPercentageErrorMessage } = calculateMargin(
		+unitPrice,
		product?.productCost || +"0",
		+discount,
		userAndOrgInfo?.marginThreshold,
	);

	useEffect(() => {
		if (total) {
			setValue(`defaultQuoteLines.${index}.total`, total);
		}
	}, [index, total, setValue]);

	const onProductChange = (value: ProductType) => {
		if (priceListContentData?.[value.id]) {
			setValue(`defaultQuoteLines.${index}.unitPrice`, priceListContentData[value.id]?.toString());
		} else {
			setValue(`defaultQuoteLines.${index}.unitPrice`, "0");
		}
		if (value.salesTax) {
			setValue(`defaultQuoteLines.${index}.taxType`, value.salesTax);
		} else {
			setValue(`defaultQuoteLines.${index}.taxType`, orderTax);
		}

		if (value?.stockAccountMappings?.revenueAccount) {
			const defaultAccount = queryClient
				.getQueryData<
					ApiResult<GetAllAccountsResponseType>
				>(["get-select-accounts", userAndOrgInfo!.orgId, ""])
				?.data.find(({ id }) => id === value.stockAccountMappings?.revenueAccount);

			if (defaultAccount) {
				setValue(`defaultQuoteLines.${index}.account`, defaultAccount);
			} else {
				setValue(`defaultQuoteLines.${index}.account`, orderAccount);
			}
		} else {
			setValue(`defaultQuoteLines.${index}.account`, orderAccount);
		}

		if (customerId) {
			const settings = queryClient.getQueryData<{ data: { customerDiscount: string | null } }>([
				"get-order-settings",
				userAndOrgInfo!.orgId,
				customerId,
			]);

			const discount = settings?.data.customerDiscount;
			if (discount != null) {
				setValue(`defaultQuoteLines.${index}.discount`, discount);
			}
		}
	};

	return (
		<TFTr>
			<TFTd>
				<Controller
					name={`defaultQuoteLines.${index}.product`}
					control={control}
					rules={{
						required: isRequired ? "Required" : false,
						onChange(event) {
							const value = event.target.value as ProductType;
							onProductChange(value);
						},
					}}
					render={({ field }) => (
						<FormTableProductSelect
							{...field}
							type="stock"
							value={field.value}
							id="orderLinesproductId"
							onValueChange={field.onChange}
							error={errors?.defaultQuoteLines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderFormValues>
					type="text"
					label="Comment"
					register={register}
					id="orderLinescommentId"
					name={`defaultQuoteLines.${index}.comment`}
					error={errors?.defaultQuoteLines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Quantity"
					register={register}
					rules={{
						min: isRequired ? 0 : undefined,
						required: isRequired ? "Required" : false,
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0) {
								setValue(`defaultQuoteLines.${index}.quantity`, "0");
							}
						},
					}}
					id="orderLinesquantityId"
					name={`defaultQuoteLines.${index}.quantity`}
					error={errors?.defaultQuoteLines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Unit Price"
					register={register}
					rules={{
						min: isRequired ? 0 : undefined,
						required: isRequired ? "Required" : false,
					}}
					id="orderLinesunitPriceId"
					name={`defaultQuoteLines.${index}.unitPrice`}
					error={
						errors?.defaultQuoteLines?.[index]?.unitPrice?.message ||
						marginErrorMesssage ||
						totalErrorMesssage
					}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderFormValues>
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
								setValue(`defaultQuoteLines.${index}.discount`, "0");
							}
						},
					}}
					id="orderLinesdiscountId"
					name={`defaultQuoteLines.${index}.discount`}
					error={errors?.defaultQuoteLines?.[index]?.discount?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					name={`defaultQuoteLines.${index}.taxType`}
					control={control}
					rules={{
						required: isRequired ? "Required" : false,
					}}
					render={({ field }) => (
						<FormTableTaxRatesSelect
							{...field}
							value={field.value as TaxRateType}
							id="orderLinesTaxTypeId"
							type="sales"
							onValueChange={field.onChange}
							error={errors?.defaultQuoteLines?.[index]?.taxType?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd isText error={marginPercentageErrorMessage}>
				{marginPercentage}%
			</TFTd>
			{userAndOrgInfo?.trackingCategoryAFiltered?.categories.length && (
				<TFTd>
					<Controller
						name={`defaultQuoteLines.${index}.trackingCategoryA`}
						control={control}
						render={({ field }) => (
							<FormTableTrackingCategorySelect
								{...field}
								data={userAndOrgInfo!.trackingCategoryAFiltered!.categories}
								value={field.value}
								id="trackingCategoryAId"
								onValueChange={field.onChange}
							/>
						)}
					/>
				</TFTd>
			)}
			{userAndOrgInfo?.trackingCategoryBFiltered?.categories.length && (
				<TFTd>
					<Controller
						name={`defaultQuoteLines.${index}.trackingCategoryB`}
						control={control}
						render={({ field }) => (
							<FormTableTrackingCategorySelect
								{...field}
								data={userAndOrgInfo!.trackingCategoryBFiltered!.categories}
								value={field.value}
								id="trackingCategoryBId"
								onValueChange={field.onChange}
							/>
						)}
					/>
				</TFTd>
			)}
			<TFTd>
				<Controller
					control={control}
					name={`defaultQuoteLines.${index}.account`}
					rules={{
						required: isRequired ? "Required" : false,
					}}
					render={({ field }) => (
						<FormTableAccountSelect
							{...field}
							value={field.value}
							id="orderLinesAccountId"
							type="salesRevenueAccount"
							onValueChange={field.onChange}
							error={errors?.defaultQuoteLines?.[index]?.account?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd isRight>{total}</TFTd>
			<TFTd>
				<button
					type="button"
					aria-label="Remove row"
					className="formTable__remove"
					onClick={() => {
						if (fields.length === 1 && index === 0) {
							update(index, EmptyDefaultOrderLine);
						} else {
							remove(index);
						}
					}}
				>
					<svg focusable="false" aria-hidden="true" width="16" height="16">
						<use xlinkHref="/icons/icons.svg#crossInCircle" />
					</svg>
				</button>
			</TFTd>
		</TFTr>
	);
};
