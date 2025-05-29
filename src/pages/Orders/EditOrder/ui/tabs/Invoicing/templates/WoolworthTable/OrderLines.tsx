import { FC } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { OrderLinesRow } from "./OrderLinesRow.tsx";

import {
	calculateWoolworthsFooterValues,
	calculateWoolworthTotal,
} from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

import { Button } from "@/components/shared/Button.tsx";

import {
	WoolworthsOrderLineType,
	WoolworthInvoicingFormValues,
	EmptyWoolworthsOrderLine,
} from "@/@types/salesOrders/local.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { ExtendedSalesOrder, FulfilmentType, InvoiceType } from "@/@types/salesOrders/api.ts";
import {
	TF,
	TFAddRow,
	TFHr,
	TFOverflow,
	TFTable,
	TFTbody,
	TFTd,
	TFTfoot,
	TFTh,
	TFThead,
	TFThFoot,
	TFTr,
	TFWrapper,
} from "@/components/widgets/Table";
import { FulfilmentsSelect } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/ui/FulfilmentSelect.tsx";
import { useGetOrderFulfilment } from "@/entities/orders/api/queries/useGetOrderFulfilment.ts";
import { ProductType } from "@/@types/products.ts";
import { TaxRateType } from "@/@types/selects.ts";
import useProductsSelect from "@/pages/Orders/EditOrder/hooks/useProductsSelect.ts";
import { useStore } from "zustand";
import { orderStore } from "@/app/stores/orderStore.ts";
import { useGetOrderInvoicing } from "@/entities/orders/api/queries/useGetOrderInvoicing.ts";
import { InvoiceSelect } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/ui/InvoiceSelect.tsx";

type Props = {
	priceListContentData: Record<string, number> | null;
	orderInfo: ExtendedSalesOrder;
	type: "invoicing" | "creditNotes";
};

export const OrderLines: FC<Props> = ({ priceListContentData, orderInfo, type }) => {
	const {
		control,
		formState: { disabled },
	} = useFormContext<WoolworthInvoicingFormValues>();
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const { invoicing, creditNotes } = useStore(orderStore);

	const { data: fulfilmentData, isSuccess: isFulfilmentSuccess } = useGetOrderFulfilment({
		organisationId: userAndOrgInfo?.orgId,
		orderId: orderInfo.id,
		disabled: type === "creditNotes",
	});

	const { update, remove, append, fields, replace } = useFieldArray({
		name: "lines",
		control,
	});

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const total = calculateWoolworthsFooterValues(allValues);

	const currentLines = useWatch({
		name: "lines",
		control,
	});

	const { data: invoicingData, isSuccess: isInvoicingSuccess } = useGetOrderInvoicing({
		organisationId: userAndOrgInfo?.orgId,
		orderId: orderInfo.id,
		disabled: type === "invoicing",
	});

	const productsSelect = useProductsSelect({
		sourceLines:
			type === "invoicing"
				? orderInfo.orderLines
				: invoicingData?.data?.salesOrderInvoices
						?.filter((invoice) => invoice?.status === "AUTHORIZED")
						?.map(({ lines }) => lines)
						?.flat(1) || [],
		orgId: userAndOrgInfo!.orgId,
		...(type === "invoicing" ? { invoicing } : {}),
		...(type === "creditNotes" ? { creditNotes } : {}),
		currentLines,
	});

	const handleSelectFulfilment = (fulfilment: FulfilmentType) => {
		replace(
			fulfilment
				.picking!.lines.filter(({ product }) => productsSelect.products.find(({ id }) => product.id === id))
				.map((line): WoolworthsOrderLineType => {
					const productForSelect = productsSelect.products.find(({ id }) => line.product.id === id);
					return {
						product: productForSelect,
						comment: "",
						mass: "",
						avgMass: "",
						sLugs:
							productForSelect?.dimensions?.lugSize === "s_lugs"
								? String(+line.quantity / (productForSelect.dimensions?.quantity || 1))
								: "",
						lLugs: "",
						packOrder: productForSelect
							? String(+line.quantity / (productForSelect.dimensions?.quantity || 1))
							: "",
						quantity: productForSelect ? line.quantity : "",
						unitPrice: "",
						discount: "",
						taxType: undefined,
						account: undefined,
						trackingCategoryA: undefined,
						trackingCategoryB: undefined,
						total: "0.00",
					};
				}),
		);
	};

	const handleSelectInvoice = (invoice: InvoiceType) => {
		replace(
			invoice.lines.map((line): WoolworthsOrderLineType => {
				return {
					product: line.product as ProductType,
					comment: line.comment || "",
					quantity: line.quantity,
					packOrder: line.packOrder || "",
					sLugs: line.sLugs ? String(line.sLugs) : "",
					lLugs: line.lLugs ? String(line.lLugs) : "",
					mass: line.mass || "",
					avgMass: line.mass ? String(+line.mass / +line.quantity) : "",
					account: line.account,
					unitPrice: line.unitPrice,
					discount: line.discount,
					taxType: line.taxRate as TaxRateType,
					trackingCategoryA: userAndOrgInfo?.trackingCategoryAFiltered?.categories.find(
						({ id }) => id === line.trackingCategoryAId,
					),
					trackingCategoryB: userAndOrgInfo?.trackingCategoryBFiltered?.categories.find(
						({ id }) => id === line.trackingCategoryBId,
					),
					total:
						line.product?.dimensions?.calculatedWith === "quantity"
							? calculateWoolworthTotal(+line.unitPrice, +line.quantity, +line.discount).total
							: calculateWoolworthTotal(+line.unitPrice, NaN, +line.discount, +line.mass!).total,
				};
			}),
		);
	};

	const handleCopyFromOrder = () => {
		replace(
			orderInfo.orderLines.map((line): WoolworthsOrderLineType => {
				return {
					product: line.product as ProductType,
					comment: line.comment || "",
					quantity: line.quantity,
					packOrder: line.packOrder || "",
					sLugs: line.sLugs ? String(line.sLugs) : "",
					lLugs: line.lLugs ? String(line.lLugs) : "",
					mass: line.mass || "",
					avgMass: line.mass ? String(+line.mass / +line.quantity) : "",
					account: line.account,
					unitPrice: line.unitPrice,
					discount: line.discount,
					taxType: line.taxRate as TaxRateType,
					trackingCategoryA: userAndOrgInfo?.trackingCategoryAFiltered?.categories.find(
						({ id }) => id === line.trackingCategoryAId,
					),
					trackingCategoryB: userAndOrgInfo?.trackingCategoryBFiltered?.categories.find(
						({ id }) => id === line.trackingCategoryBId,
					),
					total:
						line.product?.dimensions?.calculatedWith === "quantity"
							? calculateWoolworthTotal(+line.unitPrice, +line.quantity, +line.discount).total
							: calculateWoolworthTotal(+line.unitPrice, NaN, +line.discount, +line.mass!).total,
				};
			}),
		);
	};

	return (
		<>
			<TF>
				<TFWrapper>
					<TFOverflow>
						<TFTable>
							<TFThead>
								<TFTr>
									<TFTh style={{ minWidth: "140px" }}>Product</TFTh>
									<TFTh>Comment</TFTh>
									<TFTh>Pack order</TFTh>
									<TFTh>XS/S Lugs</TFTh>
									<TFTh>L Lugs</TFTh>
									<TFTh>Quantity</TFTh>
									<TFTh>Mass</TFTh>
									<TFTh>Avg KG</TFTh>
									<TFTh>Price</TFTh>
									<TFTh>Discount %</TFTh>
									<TFTh style={{ minWidth: "140px" }}>Tax</TFTh>
									<TFTh>Margin</TFTh>
									{!!userAndOrgInfo?.trackingCategoryAFiltered?.categories.length && (
										<TFTh style={{ minWidth: "140px" }}>{userAndOrgInfo.trackingCategoryAFiltered.name}</TFTh>
									)}
									{!!userAndOrgInfo?.trackingCategoryBFiltered?.categories.length && (
										<TFTh style={{ minWidth: "140px" }}>{userAndOrgInfo.trackingCategoryBFiltered.name}</TFTh>
									)}
									<TFTh style={{ minWidth: "140px" }}>Account</TFTh>
									<TFTh isRight>Total</TFTh>
									<TFTh isActions></TFTh>
								</TFTr>
							</TFThead>

							{fields.length > 0 ? (
								<>
									<TFTbody>
										{fields.map((field, index) => (
											<OrderLinesRow
												key={field.id}
												index={index}
												fields={fields}
												update={update}
												remove={remove}
												control={control}
												priceListContentData={priceListContentData}
												productsSelect={productsSelect}
												orderInfo={orderInfo}
											/>
										))}
									</TFTbody>
									<TFTfoot>
										<TFTr>
											<TFThFoot>Total</TFThFoot>
											<TFThFoot />
											<TFThFoot />
											<TFThFoot>{total.totalSLugs}</TFThFoot>
											<TFThFoot>{total.totalLLugs}</TFThFoot>
											<TFThFoot>{total.totalQuantity}</TFThFoot>
											<TFThFoot>{total.totalMass}</TFThFoot>
											<TFThFoot>{total.totalAvgMass}</TFThFoot>
											<TFThFoot>{total.totalPrice}</TFThFoot>
											<TFThFoot />
											<TFThFoot />
											<TFThFoot />
											<TFThFoot />
											{!!userAndOrgInfo?.trackingCategoryAFiltered?.categories.length && <TFThFoot />}
											{!!userAndOrgInfo?.trackingCategoryBFiltered?.categories.length && <TFThFoot />}
											<TFThFoot isRight>{total.total}</TFThFoot>
											<TFThFoot isActions />
										</TFTr>
									</TFTfoot>
								</>
							) : (
								<TFTbody>
									<TFTr>
										<TFTd isEmpty>No data available</TFTd>
									</TFTr>
								</TFTbody>
							)}
						</TFTable>
					</TFOverflow>
				</TFWrapper>
			</TF>
			<div style={{ marginTop: "-50px" }}>
				<TFAddRow>
					{!!orderInfo?.orderLines && type === "invoicing" && (
						<Button type="button" disabled={disabled} isSecondary onClick={handleCopyFromOrder}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#copy" />
							</svg>
							Copy from Order
						</Button>
					)}
					{isFulfilmentSuccess && type === "invoicing" && fulfilmentData.data.fulfillments.length > 0 && (
						<FulfilmentsSelect
							disabled={disabled}
							fulfilments={fulfilmentData.data.fulfillments}
							onValueChange={handleSelectFulfilment}
						/>
					)}
					{isInvoicingSuccess &&
						type === "creditNotes" &&
						invoicingData.data.salesOrderInvoices.length > 0 && (
							<InvoiceSelect
								disabled={disabled}
								invoices={invoicingData.data.salesOrderInvoices}
								onValueChange={handleSelectInvoice}
							/>
						)}
					<Button
						type="button"
						disabled={disabled}
						isSecondary
						onClick={() => append({ ...EmptyWoolworthsOrderLine })}
					>
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#plus" />
						</svg>
						Add Row
					</Button>
				</TFAddRow>
				<TFHr />
			</div>
		</>
	);
};
