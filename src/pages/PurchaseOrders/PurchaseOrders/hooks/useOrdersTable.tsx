import { useMemo } from "react";

import { TableLink, TableStatus, TableTd, TableTh } from "@/components/widgets/Table";

import { useLayoutOptions } from "@/hooks/useLayoutOptions";

import { getFormDayPickerDate } from "@/utils/date";
import { formatNumberToCurrency } from "@/utils/formatNumberToCurrency";

import {
	PurchaseOrderXeroStatuses,
	PurchaseOrderBillStatuses,
	PurchaseOrderStockStatuses,
	PurchaseOrderPaymentStatuses,
	PurchaseOrderOverallStatuses,
} from "@/@types/purchaseOrder/statuses";
import { PurchaseOrderType } from "@/@types/purchaseOrder/order";
import { LayputOptionsData, TableColumnData } from "@/@types/utility";

export const useOrdersTable = () => {
	const layoutOptionsData: LayputOptionsData = useMemo(
		() => ({
			from: { key: "from", name: "From", isShown: true },
			reference: { key: "reference", name: "Ref", isShown: true },
			poNumber: { key: "poNumber", name: "Purchase Order", isShown: true },
			orderDate: { key: "orderDate", name: "Order Date", isShown: true },
			stockStatus: { key: "stockStatus", name: "Stock Status", isShown: true },
			total: { key: "total", name: "Total", isShown: true },
			location: { key: "location", name: "Location", isShown: true },
			currency: { key: "currency", name: "Currency", isShown: true },
			overallStatus: { key: "overallStatus", name: "Overall Status", isShown: true },
			expectedDeliveryDate: { key: "expectedDeliveryDate", name: "Expected Delivery Date", isShown: true },
			billNumber: { key: "billNumber", name: "Bill Number", isShown: true },
			xeroStatus: { key: "xeroStatus", name: "Xero Status", isShown: true },
			paymentStatus: { key: "paymentStatus", name: "Payment Status", isShown: true },
			billStatus: { key: "billStatus", name: "Bill Status", isShown: true },
		}),
		[],
	);

	const { layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useLayoutOptions(
		"purchaseOrderLayoutOptions",
		layoutOptionsData,
	);

	const columns = useMemo<TableColumnData[]>(
		() => [
			{
				key: "from",
				label: "From",
				renderHeader: (item, index) => (
					<TableTh
						key={`${item.key}-${index}`}
						isShown={layoutOptions.from.isShown}
						style={{ width: "15%", minWidth: "110px" }}
					>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.from.isShown}>
							{item.from}
						</TableTd>
					);
				},
			},
			{
				key: "reference",
				label: "Ref",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.reference.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd isOverflow key={`${column.key}-${item.id}`} isShown={layoutOptions.reference.isShown}>
							{item.reference ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "poNumber",
				label: "Purchase Order",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.poNumber.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.poNumber.isShown}>
							<TableLink to={`/purchases/orders/edit/${item.id}`}>{item.poNumber ?? "View Draft"}</TableLink>
						</TableTd>
					);
				},
			},
			{
				key: "orderDate",
				label: "Order Date",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.orderDate.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.orderDate.isShown}>
							{getFormDayPickerDate(item.orderDate)}
						</TableTd>
					);
				},
			},
			{
				key: "stockStatus",
				label: "Stock Status",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.stockStatus.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.stockStatus.isShown}>
							<TableStatus
								isRed={item.stockStatus === "NOT_RECEIVED"}
								isYellow={item.stockStatus === "PARTIALLY_RECEIVED"}
								isGreen={item.stockStatus === "RECEIVED" || item.stockStatus === "FULLY_RECEIVED"}
							>
								{PurchaseOrderStockStatuses[item.stockStatus]}
							</TableStatus>
						</TableTd>
					);
				},
			},
			{
				key: "total",
				label: "Total",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.total.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.total.isShown}>
							{formatNumberToCurrency(item.total)}
						</TableTd>
					);
				},
			},
			{
				key: "location",
				label: "Location",
				renderHeader: (item, index) => (
					<TableTh
						key={`${item.key}-${index}`}
						isShown={layoutOptions.location.isShown}
						style={{ width: "15%", minWidth: "110px" }}
					>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.location.isShown}>
							{item.location ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "currency",
				label: "Currency",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.currency.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.currency.isShown}>
							{item.currency ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "overallStatus",
				label: "Overall Status",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.overallStatus.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.overallStatus.isShown}>
							<TableStatus
								isRed={item.overallStatus === "VOID"}
								isGreen={item.overallStatus === "CLOSED"}
								isYellow={item.overallStatus !== "VOID" && item.overallStatus !== "CLOSED"}
							>
								{PurchaseOrderOverallStatuses[item.overallStatus]}
							</TableStatus>
						</TableTd>
					);
				},
			},
			{
				key: "expectedDeliveryDate",
				label: "Expected Delivery Date",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.expectedDeliveryDate.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.expectedDeliveryDate.isShown}>
							{getFormDayPickerDate(item.expectedDeliveryDate)}
						</TableTd>
					);
				},
			},
			{
				key: "billNumber",
				label: "Bill Number",
				renderHeader: (item, index) => (
					<TableTh
						style={{ minWidth: "120px" }}
						key={`${item.key}-${index}`}
						isShown={layoutOptions.billNumber.isShown}
					>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd
							isOverflow
							isCapitalize
							key={`${column.key}-${item.id}`}
							isShown={layoutOptions.billNumber.isShown}
						>
							{item.billNumber.length
								? item.billNumber.length > 1
									? item.billNumber.join(", ")
									: item.billNumber[0]
								: "-"}
						</TableTd>
					);
				},
			},
			{
				key: "xeroStatus",
				label: "Xero Status",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.xeroStatus.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.xeroStatus.isShown}>
							<TableStatus
								isRed={item.xeroStatus === "VOID"}
								isYellow={item.xeroStatus === "NOT_POSTED"}
								isGreen={item.xeroStatus === "POSTED" || item.xeroStatus === "PAID"}
							>
								{PurchaseOrderXeroStatuses[item.xeroStatus]}
							</TableStatus>
						</TableTd>
					);
				},
			},
			{
				key: "paymentStatus",
				label: "Payment Status",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.paymentStatus.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.paymentStatus.isShown}>
							<TableStatus
								isGreen={item.paymentStatus === "PAID"}
								isRed={item.paymentStatus === "UNPAID"}
								isYellow={item.paymentStatus === "PARTIALLY_PAID"}
							>
								{PurchaseOrderPaymentStatuses[item.paymentStatus]}
							</TableStatus>
						</TableTd>
					);
				},
			},
			{
				key: "billStatus",
				label: "Bill Status",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.billStatus.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: PurchaseOrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.billStatus.isShown}>
							<TableStatus
								isRed={item.billStatus === "NOT_BILLED"}
								isGreen={item.billStatus === "FULLY_BILLED"}
								isYellow={item.billStatus === "PARTIALLY_BILLED"}
							>
								{PurchaseOrderBillStatuses[item.billStatus]}
							</TableStatus>
						</TableTd>
					);
				},
			},
		],
		[layoutOptions],
	);

	return {
		columns,
		layoutOptions,
		handleResetLayoutOptions,
		handleToggleLayoutOptions,
	};
};
