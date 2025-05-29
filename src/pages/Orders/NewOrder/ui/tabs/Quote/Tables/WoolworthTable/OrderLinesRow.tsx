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
	UseFormTrigger,
	useWatch,
} from "react-hook-form";

import {
	calculateMargin,
	calculateWoolworthTotal,
} from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf.tsx";

import {
	FormTableAccountSelect,
	FormTableProductSelect,
	FormTableTaxRatesSelect,
} from "@/components/widgets/Selects";

import { ProductType } from "@/@types/products.ts";
import { EmptyWoolworthsOrderLine, OrderFormValues } from "@/@types/salesOrders/local.ts";
import { GetAllAccountsResponseType, TaxRateType } from "@/@types/selects.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { FormTableTrackingCategorySelect } from "@/components/widgets/Selects/ui/FormTableTrackingCategorySelect.tsx";
import { Template } from "@/@types/salesOrders/api.ts";
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
	update: UseFieldArrayUpdate<OrderFormValues, "woolworthsQuoteLines">;
	fields: FieldArrayWithId<OrderFormValues, "woolworthsQuoteLines", "id">[];
	isSubmitted: boolean;
	trigger: UseFormTrigger<OrderFormValues>;
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
	trigger,
	isSubmitted,
}) => {
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const queryClient = useQueryClient();

	const allValues = useWatch({
		name: "woolworthsQuoteLines",
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

	const isRequired = template.id === Template.WOOLWORTHS && !skipQuote;

	const currentValues = allValues[index];
	const { quantity, unitPrice, discount, product, avgMass, sLugs, lLugs, mass, packOrder } = currentValues;

	const { total, totalErrorMesssage } = useMemo(() => {
		if (product?.dimensions?.calculatedWith === "weight") {
			return calculateWoolworthTotal(+unitPrice, NaN, +discount, +mass);
		} else {
			return calculateWoolworthTotal(+unitPrice, +quantity, +discount);
		}
	}, [product?.dimensions?.calculatedWith, unitPrice, discount, mass, quantity]);

	const { marginPercentage, marginErrorMesssage, marginPercentageErrorMessage } = calculateMargin(
		+unitPrice,
		product?.productCost || +"0",
		+discount,
		userAndOrgInfo?.marginThreshold,
	);

	useEffect(() => {
		if (total) {
			setValue(`woolworthsQuoteLines.${index}.total`, total);
		}
	}, [index, total, setValue]);

	const onProductChange = (value: ProductType) => {
		if (priceListContentData?.[value.id]) {
			setValue(`woolworthsQuoteLines.${index}.unitPrice`, priceListContentData[value.id]?.toString());
		} else {
			setValue(`woolworthsQuoteLines.${index}.unitPrice`, "0");
		}
		if (value.salesTax) {
			setValue(`woolworthsQuoteLines.${index}.taxType`, value.salesTax);
		} else {
			setValue(`woolworthsQuoteLines.${index}.taxType`, orderTax);
		}

		if (value?.stockAccountMappings?.revenueAccount) {
			const defaultAccount = queryClient
				.getQueryData<
					ApiResult<GetAllAccountsResponseType>
				>(["get-select-accounts", userAndOrgInfo!.orgId, ""])
				?.data.find(({ id }) => id === value.stockAccountMappings?.revenueAccount);

			if (defaultAccount) {
				setValue(`woolworthsQuoteLines.${index}.account`, defaultAccount);
			} else {
				setValue(`woolworthsQuoteLines.${index}.account`, orderAccount);
			}
		} else {
			setValue(`woolworthsQuoteLines.${index}.account`, orderAccount);
		}

		if (customerId) {
			const settings = queryClient.getQueryData<{ data: { customerDiscount: string | null } }>([
				"get-order-settings",
				userAndOrgInfo!.orgId,
				customerId,
			]);

			const discount = settings?.data.customerDiscount;
			if (discount != null) {
				setValue(`woolworthsQuoteLines.${index}.discount`, discount);
			}
		}

		if (isSubmitted) setTimeout(() => trigger("woolworthsQuoteLines"), 20);
	};

	const onPackOrderChange = (value: number) => {
		if (value && product?.dimensions?.quantity) {
			setValue(`woolworthsQuoteLines.${index}.quantity`, String(value * product.dimensions.quantity));
			if (mass) {
				setValue(
					`woolworthsQuoteLines.${index}.avgMass`,
					String((+mass / (value * product.dimensions.quantity)).toFixed(2)),
				);
			} else {
				setValue(`woolworthsQuoteLines.${index}.avgMass`, "");
			}
			if (product.dimensions.lugSize === "s_lugs") {
				setValue(`woolworthsQuoteLines.${index}.sLugs`, String(value));
				setValue(`woolworthsQuoteLines.${index}.lLugs`, "");
			}
			if (product.dimensions.lugSize === "l_lugs") {
				setValue(`woolworthsQuoteLines.${index}.lLugs`, String(value));
				setValue(`woolworthsQuoteLines.${index}.sLugs`, "");
			}
		} else {
			setValue(`woolworthsQuoteLines.${index}.quantity`, "");
			setValue(`woolworthsQuoteLines.${index}.sLugs`, "");
			setValue(`woolworthsQuoteLines.${index}.lLugs`, "");
			setValue(`woolworthsQuoteLines.${index}.avgMass`, "");
		}
	};

	const onMassChange = (value: number) => {
		if (value && quantity) {
			setValue(`woolworthsQuoteLines.${index}.avgMass`, String((value / +quantity).toFixed(2)));
		} else {
			setValue(`woolworthsQuoteLines.${index}.avgMass`, "");
		}
	};

	return (
		<TFTr>
			<TFTd>
				<Controller
					name={`woolworthsQuoteLines.${index}.product`}
					control={control}
					rules={{
						required: isRequired ? "Required" : false,
						onChange(event) {
							const value = event.target.value as ProductType;
							onProductChange(value);
							if (packOrder) {
								onPackOrderChange(+packOrder);
							}
						},
					}}
					render={({ field }) => (
						<FormTableProductSelect
							{...field}
							template="WOOL"
							type="stock"
							value={field.value}
							id="orderLinesproductId"
							onValueChange={field.onChange}
							error={errors?.woolworthsQuoteLines?.[index]?.product?.message}
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
					name={`woolworthsQuoteLines.${index}.comment`}
					error={errors?.woolworthsQuoteLines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<OrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Pack Order"
					register={register}
					rules={{
						min: isRequired ? { value: 1, message: "Required" } : undefined,
						required: isRequired ? "Required" : false,
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0) {
								setValue(`woolworthsQuoteLines.${index}.packOrder`, "0");
							}
							onPackOrderChange(value < 0 ? 0 : value);
						},
					}}
					id="orderLinesPackOrderId"
					name={`woolworthsQuoteLines.${index}.packOrder`}
					error={errors?.woolworthsQuoteLines?.[index]?.packOrder?.message}
				/>
			</TFTd>
			<TFTd isText>{sLugs}</TFTd>
			<TFTd isText>{lLugs}</TFTd>
			<TFTd isText>{quantity}</TFTd>
			<TFTd>
				<TableInputRhf<OrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Mass"
					register={register}
					rules={{
						min:
							isRequired && product?.dimensions?.calculatedWith === "weight"
								? { value: 1, message: "Required" }
								: undefined,
						required: isRequired && product?.dimensions?.calculatedWith === "weight" ? "Required" : false,
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0) {
								setValue(`woolworthsQuoteLines.${index}.mass`, "0");
							}
							onMassChange(value < 0 ? 0 : value);
						},
					}}
					id="orderLinesMassId"
					name={`woolworthsQuoteLines.${index}.mass`}
					error={errors?.woolworthsQuoteLines?.[index]?.mass?.message}
				/>
			</TFTd>
			<TFTd isText>{avgMass}</TFTd>
			<TFTd>
				<TableInputRhf<OrderFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Unit Price"
					register={register}
					rules={{
						min: isRequired ? { value: 0.01, message: "Required" } : undefined,
						required: isRequired ? "Required" : false,
					}}
					id="orderLinesunitPriceId"
					name={`woolworthsQuoteLines.${index}.unitPrice`}
					error={
						errors?.woolworthsQuoteLines?.[index]?.unitPrice?.message ||
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
								setValue(`woolworthsQuoteLines.${index}.discount`, "0");
							}
						},
					}}
					id="orderLinesdiscountId"
					name={`woolworthsQuoteLines.${index}.discount`}
					error={errors?.woolworthsQuoteLines?.[index]?.discount?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					name={`woolworthsQuoteLines.${index}.taxType`}
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
							error={errors?.woolworthsQuoteLines?.[index]?.taxType?.message}
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
						name={`woolworthsQuoteLines.${index}.trackingCategoryA`}
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
						name={`woolworthsQuoteLines.${index}.trackingCategoryB`}
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
					name={`woolworthsQuoteLines.${index}.account`}
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
							error={errors?.woolworthsQuoteLines?.[index]?.account?.message}
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
							update(index, EmptyWoolworthsOrderLine);
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
