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

import { calculateMargin, calculateTotal } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf.tsx";

import { FormTableAccountSelect, FormTableTaxRatesSelect } from "@/components/widgets/Selects";

import { ProductType } from "@/@types/products.ts";
import { DefaultInvoicingFormValues, EmptyDefaultOrderLine } from "@/@types/salesOrders/local.ts";
import { GetAllAccountsResponseType, TaxRateType } from "@/@types/selects.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { FormTableTrackingCategorySelect } from "@/components/widgets/Selects/ui/FormTableTrackingCategorySelect.tsx";
import { TFTd, TFTr } from "@/components/widgets/Table";
import { ProductForSelect, validateQuantity } from "@/pages/Orders/EditOrder/hooks/useProductsSelect.ts";
import { FormTableProductSelectWithCount } from "@/components/widgets/Selects/ui/FormTableProductSelectWithCount.tsx";
import { ApiResult } from "@/@types/api.ts";
import { useQueryClient } from "@tanstack/react-query";
import { ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	control: Control<DefaultInvoicingFormValues, unknown>;
	priceListContentData: Record<string, number> | null;
	update: UseFieldArrayUpdate<DefaultInvoicingFormValues, "lines">;
	fields: FieldArrayWithId<DefaultInvoicingFormValues, "lines", "id">[];
	productsSelect: { products: ProductForSelect[]; isLoading: boolean };
	orderInfo: ExtendedSalesOrder;
};

export const OrderLinesRow: FC<Props> = ({
	index,
	fields,
	control,
	remove,
	update,
	priceListContentData,
	productsSelect,
	orderInfo,
}) => {
	const {
		setValue,
		register,
		trigger,
		formState: { errors, disabled, isSubmitted },
	} = useFormContext<DefaultInvoicingFormValues>();
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const queryClient = useQueryClient();

	const allValues = useWatch({
		name: "lines",
		control,
	});

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
			setValue(`lines.${index}.total`, total);
		}
	}, [index, total, setValue]);

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
				<TableInputRhf<DefaultInvoicingFormValues>
					type="text"
					label="Comment"
					register={register}
					id="orderLinescommentId"
					name={`lines.${index}.comment`}
					error={errors?.lines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<DefaultInvoicingFormValues>
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
				<TableInputRhf<DefaultInvoicingFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Unit Price"
					register={register}
					rules={{
						min: 0,
						required: "Required",
					}}
					id="orderLinesunitPriceId"
					name={`lines.${index}.unitPrice`}
					error={errors?.lines?.[index]?.unitPrice?.message || marginErrorMesssage || totalErrorMesssage}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<DefaultInvoicingFormValues>
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
			<TFTd isRight>{total}</TFTd>
			<TFTd>
				<button
					disabled={disabled}
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
