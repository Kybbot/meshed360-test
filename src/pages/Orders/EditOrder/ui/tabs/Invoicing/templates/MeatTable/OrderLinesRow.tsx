import { FC, useEffect, useMemo } from "react";
import {
	Control,
	Controller,
	FieldArrayWithId,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
	useFormContext,
	useWatch,
} from "react-hook-form";

import { calculateMargin, calculatePrice } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf.tsx";

import { FormTableAccountSelect, FormTableTaxRatesSelect } from "@/components/widgets/Selects";

import { ProductType } from "@/@types/products.ts";
import { EmptyMeatOrderLine, MeatInvoicingFormValues } from "@/@types/salesOrders/local.ts";
import { GetAllAccountsResponseType, TaxRateType } from "@/@types/selects.ts";
import { FormTableTrackingCategorySelect } from "@/components/widgets/Selects/ui/FormTableTrackingCategorySelect.tsx";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { TFTd, TFTr } from "@/components/widgets/Table";
import { ProductForSelect, validateQuantity } from "@/pages/Orders/EditOrder/hooks/useProductsSelect.ts";
import { FormTableProductSelectWithCount } from "@/components/widgets/Selects/ui/FormTableProductSelectWithCount.tsx";
import { ApiResult } from "@/@types/api.ts";
import { useQueryClient } from "@tanstack/react-query";
import { ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	control: Control<MeatInvoicingFormValues, unknown>;
	priceListContentData: Record<string, number> | null;
	update: UseFieldArrayUpdate<MeatInvoicingFormValues, "lines">;
	fields: FieldArrayWithId<MeatInvoicingFormValues, "lines", "id">[];
	productsSelect: { products: ProductForSelect[]; isLoading: boolean };
	orderInfo: ExtendedSalesOrder;
};

export const OrderLinesRow: FC<Props> = ({
	index,
	fields,
	control,
	remove,
	update,
	productsSelect,
	orderInfo,
	priceListContentData,
}) => {
	const {
		setValue,
		register,
		trigger,
		formState: { errors, disabled, isSubmitted },
	} = useFormContext<MeatInvoicingFormValues>();
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

	const productWithCount = useMemo(() => {
		if (productsSelect.products && product) {
			return productsSelect.products.find(({ id }) => id === product.id);
		} else {
			return undefined;
		}
	}, [productsSelect.products, product]);

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
			return Number(mass) / Number(quantity);
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
						<FormTableProductSelectWithCount
							{...field}
							value={field.value}
							id="orderLinesproductId"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.product?.message}
							products={productsSelect.products}
							isLoading={productsSelect.isLoading}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<MeatInvoicingFormValues>
					type="text"
					label="Comment"
					register={register}
					id="orderLinescommentId"
					name={`lines.${index}.comment`}
					error={errors?.lines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<MeatInvoicingFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Quantity"
					register={register}
					rules={{
						min: {
							value: 1,
							message: "Min quantity is 1",
						},
						validate: (_, formValues): true | string => {
							return validateQuantity({ productWithCount, lines: formValues.lines });
						},
						required: "Required",
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0) {
								setValue(`lines.${index}.quantity`, "0");
							}
							if (isSubmitted) trigger("lines");
						},
					}}
					id="orderLinesquantityId"
					name={`lines.${index}.quantity`}
					error={errors?.lines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<MeatInvoicingFormValues>
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
				<TableInputRhf<MeatInvoicingFormValues>
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
				<TableInputRhf<MeatInvoicingFormValues>
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
