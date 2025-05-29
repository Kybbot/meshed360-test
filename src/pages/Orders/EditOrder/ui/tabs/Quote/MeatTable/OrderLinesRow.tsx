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
import { EmptyMeatOrderLine, MeatOrderFormValues } from "@/@types/salesOrders/local.ts";
import { GetAllAccountsResponseType, TaxRateType } from "@/@types/selects.ts";
import { FormTableTrackingCategorySelect } from "@/components/widgets/Selects/ui/FormTableTrackingCategorySelect.tsx";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { TFTd, TFTr } from "@/components/widgets/Table";
import { ApiResult } from "@/@types/api.ts";
import { useQueryClient } from "@tanstack/react-query";
import { ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<MeatOrderFormValues>;
	control: Control<MeatOrderFormValues, unknown>;
	register: UseFormRegister<MeatOrderFormValues>;
	setValue: UseFormSetValue<MeatOrderFormValues>;
	priceListContentData: Record<string, number> | null;
	update: UseFieldArrayUpdate<MeatOrderFormValues, "lines">;
	fields: FieldArrayWithId<MeatOrderFormValues, "lines", "id">[];
	isSubmitted: boolean;
	disabled: boolean;
	orderInfo: ExtendedSalesOrder;
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
	disabled,
	orderInfo,
	priceListContentData,
}) => {
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const queryClient = useQueryClient();

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const currentValues = allValues[index];
	const { quantity, discount, product, mass, total } = currentValues;

	const { price, priceErrorMesssage } = calculatePrice(+total, +quantity, +discount);
	const { marginPercentage, marginErrorMesssage, marginPercentageErrorMessage } = calculateMargin(
		+price,
		product?.productCost || +"0",
		+discount,
		userAndOrgInfo?.marginThreshold,
	);

	useEffect(() => {
		if (price) {
			setValue(`lines.${index}.unitPrice`, price);
		}
	}, [index, price, setValue]);

	const onProductChange = (value: ProductType) => {
		if (priceListContentData?.[value.id]) {
			setValue(`lines.${index}.unitPrice`, priceListContentData[value.id]?.toString());
		} else {
			setValue(`lines.${index}.unitPrice`, "0");
		}
		if (value.salesTax) {
			setValue(`lines.${index}.taxType`, value.salesTax);
		} else {
			setValue(`lines.${index}.taxType`, orderInfo.taxRate as TaxRateType);
		}

		setValue(`lines.${index}.discount`, orderInfo.customer.discount ?? "");

		if (value?.stockAccountMappings?.revenueAccount) {
			const defaultAccount = queryClient
				.getQueryData<
					ApiResult<GetAllAccountsResponseType>
				>(["get-select-accounts", userAndOrgInfo!.orgId, ""])
				?.data.find(({ id }) => id === value.stockAccountMappings?.revenueAccount);

			if (defaultAccount) {
				setValue(`lines.${index}.account`, defaultAccount);
			} else {
				setValue(`lines.${index}.account`, orderInfo.account);
			}
		} else {
			setValue(`lines.${index}.account`, orderInfo.account);
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
					name={`lines.${index}.product`}
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
							type="stock"
							value={field.value}
							id="orderLinesproductId"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<MeatOrderFormValues>
					type="text"
					label="Comment"
					register={register}
					id="orderLinescommentId"
					name={`lines.${index}.comment`}
					error={errors?.lines?.[index]?.comment?.message}
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
								setValue(`lines.${index}.quantity`, "0");
							}
						},
					}}
					id="orderLinesquantityId"
					name={`lines.${index}.quantity`}
					error={errors?.lines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<MeatOrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Mass"
					register={register}
					rules={{
						min: 0,
						required: "Required",
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0) {
								setValue(`lines.${index}.mass`, "0");
							}
						},
					}}
					id="orderLinesMassId"
					name={`lines.${index}.mass`}
					error={errors?.lines?.[index]?.mass?.message}
				/>
			</TFTd>
			<TFTd isText>{avgMass}</TFTd>
			<TFTd isText>{price}</TFTd>
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
							id="orderLinesAccountId"
							type="salesRevenueAccount"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.account?.message}
						/>
					)}
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
								setValue(`lines.${index}.discount`, "0");
							}
						},
					}}
					id="orderLinesdiscountId"
					name={`lines.${index}.discount`}
					error={errors?.lines?.[index]?.discount?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					name={`lines.${index}.taxType`}
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableTaxRatesSelect
							{...field}
							value={field.value as TaxRateType}
							id="orderLinesTaxTypeId"
							type="sales"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.taxType?.message}
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
						name={`lines.${index}.trackingCategoryA`}
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
						name={`lines.${index}.trackingCategoryB`}
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
				<TableInputRhf<MeatOrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Total"
					register={register}
					rules={{
						min: 1,
						required: "Required",
					}}
					id="orderLinesunitPriceId"
					name={`lines.${index}.total`}
					error={errors?.lines?.[index]?.total?.message || marginErrorMesssage || priceErrorMesssage}
				/>
			</TFTd>
			<TFTd>
				<button
					disabled={disabled}
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
