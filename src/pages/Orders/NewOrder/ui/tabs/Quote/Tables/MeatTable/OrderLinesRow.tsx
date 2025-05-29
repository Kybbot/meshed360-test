import { FC, useEffect, useMemo } from "react";
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

import { calculateMargin, calculatePrice } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf.tsx";

import {
	FormTableAccountSelect,
	FormTableProductSelect,
	FormTableTaxRatesSelect,
} from "@/components/widgets/Selects";

import { ProductType } from "@/@types/products.ts";
import { EmptyMeatOrderLine, OrderFormValues } from "@/@types/salesOrders/local.ts";
import { GetAllAccountsResponseType, TaxRateType } from "@/@types/selects.ts";
import { FormTableTrackingCategorySelect } from "@/components/widgets/Selects/ui/FormTableTrackingCategorySelect.tsx";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
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
	update: UseFieldArrayUpdate<OrderFormValues, "meatQuoteLines">;
	fields: FieldArrayWithId<OrderFormValues, "meatQuoteLines", "id">[];
	isSubmitted: boolean;
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
		name: "meatQuoteLines",
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

	const customerId = useWatch({
		name: "customer.id",
		control,
	});

	const isRequired = template.id === "MEAT" && !skipQuote;

	const currentValues = allValues[index];
	const { quantity, discount, mass, total, product } = currentValues;

	const { price, priceErrorMesssage } = calculatePrice(+total, +quantity, +discount);
	const { marginPercentage, marginErrorMesssage, marginPercentageErrorMessage } = calculateMargin(
		+price,
		product?.productCost || +"0",
		+discount,
		userAndOrgInfo?.marginThreshold,
	);

	useEffect(() => {
		if (price) {
			setValue(`meatQuoteLines.${index}.unitPrice`, price);
		}
	}, [index, price, setValue]);

	const orderAccount = useWatch({
		name: "account",
		control,
	});

	const orderTax = useWatch({
		name: "taxRate",
		control,
	});

	const onProductChange = (value: ProductType) => {
		if (priceListContentData?.[value.id]) {
			setValue(`defaultQuoteLines.${index}.unitPrice`, priceListContentData[value.id]?.toString());
		} else {
			setValue(`defaultQuoteLines.${index}.unitPrice`, "0");
		}
		if (value.salesTax) {
			setValue(`meatQuoteLines.${index}.taxType`, value.salesTax);
		} else {
			setValue(`meatQuoteLines.${index}.taxType`, orderTax);
		}

		if (value?.stockAccountMappings?.revenueAccount) {
			const defaultAccount = queryClient
				.getQueryData<
					ApiResult<GetAllAccountsResponseType>
				>(["get-select-accounts", userAndOrgInfo!.orgId, ""])
				?.data.find(({ id }) => id === value.stockAccountMappings?.revenueAccount);

			if (defaultAccount) {
				setValue(`meatQuoteLines.${index}.account`, defaultAccount);
			} else {
				setValue(`meatQuoteLines.${index}.account`, orderAccount);
			}
		} else {
			setValue(`meatQuoteLines.${index}.account`, orderAccount);
		}

		if (customerId) {
			const settings = queryClient.getQueryData<{ data: { customerDiscount: string | null } }>([
				"get-order-settings",
				userAndOrgInfo!.orgId,
				customerId,
			]);

			const discount = settings?.data.customerDiscount;
			if (discount != null) {
				setValue(`meatQuoteLines.${index}.discount`, discount);
			}
		}
	};

	const avgMass = useMemo(() => {
		if (Number(mass) && Number(quantity)) {
			return (Number(mass) / Number(quantity)).toFixed(2);
		} else {
			return "";
		}
	}, [mass, quantity]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					name={`meatQuoteLines.${index}.product`}
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
							error={errors?.meatQuoteLines?.[index]?.product?.message}
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
					name={`meatQuoteLines.${index}.comment`}
					error={errors?.meatQuoteLines?.[index]?.comment?.message}
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
								setValue(`meatQuoteLines.${index}.quantity`, "0");
							}
						},
					}}
					id="orderLinesquantityId"
					name={`meatQuoteLines.${index}.quantity`}
					error={errors?.meatQuoteLines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Mass"
					register={register}
					rules={{
						min: isRequired ? 0 : undefined,
						required: isRequired ? "Required" : false,
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0) {
								setValue(`meatQuoteLines.${index}.mass`, "0");
							}
						},
					}}
					id="orderLinesMassId"
					name={`meatQuoteLines.${index}.mass`}
					error={errors?.meatQuoteLines?.[index]?.mass?.message}
				/>
			</TFTd>
			<TFTd isText>{avgMass}</TFTd>
			<TFTd isText>{price}</TFTd>
			<TFTd>
				<TableInputRhf<OrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Discount"
					register={register}
					rules={{
						min: isRequired ? 0 : undefined,
						max: isRequired ? 100 : undefined,
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0 || value > 100) {
								setValue(`meatQuoteLines.${index}.discount`, "0");
							}
						},
					}}
					id="orderLinesdiscountId"
					name={`meatQuoteLines.${index}.discount`}
					error={errors?.meatQuoteLines?.[index]?.discount?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					name={`meatQuoteLines.${index}.taxType`}
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
							error={errors?.meatQuoteLines?.[index]?.taxType?.message}
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
						name={`meatQuoteLines.${index}.trackingCategoryA`}
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
						name={`meatQuoteLines.${index}.trackingCategoryB`}
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
					name={`meatQuoteLines.${index}.account`}
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
							error={errors?.meatQuoteLines?.[index]?.account?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Total"
					register={register}
					rules={{
						min: isRequired ? 0 : undefined,
						required: isRequired ? "Required" : false,
					}}
					id="orderLinesunitPriceId"
					name={`meatQuoteLines.${index}.total`}
					error={errors?.meatQuoteLines?.[index]?.total?.message || marginErrorMesssage || priceErrorMesssage}
				/>
			</TFTd>
			<TFTd>
				<button
					type="button"
					aria-label="Remove row"
					className="formTable__remove"
					onClick={() => {
						if (fields.length === 1 && index === 0) {
							update(index, EmptyMeatOrderLine);
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
