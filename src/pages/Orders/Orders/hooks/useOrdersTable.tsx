import { useMemo } from "react";

import { TableLink, TableStatus, TableTd, TableTh } from "@/components/widgets/Table";

import { useLayoutOptions } from "@/hooks/useLayoutOptions";

import { getFormDayPickerDate } from "@/utils/date";
import { formatNumberToCurrency } from "@/utils/formatNumberToCurrency";

import {
	orderStatusDictionary,
	packingStatusDictionary,
	paymentStatusDictionary,
	pickingStatusDictionary,
	shippingStatusDictionary,
	templateDictionary,
	xeroStatusDictionary,
} from "@/@types/salesOrders/local.ts";

import {
	OrderStatus,
	OrderType,
	PackingStatus,
	PaymentStatus,
	PickingStatus,
	ShippingStatus,
} from "@/@types/salesOrders/api.ts";
import { LayputOptionsData, TableColumnData } from "@/@types/utility";

export const useOrdersTable = () => {
	const layoutOptionsData: LayputOptionsData = useMemo(
		() => ({
			customerName: { key: "customerName", name: "To", isShown: true },
			reference: { key: "reference", name: "Ref", isShown: true },
			soNumber: { key: "soNumber", name: "Sales Order", isShown: true },
			soDate: { key: "soDate", name: "Order Date", isShown: true },
			salesRepName: { key: "salesRepName", name: "Sales Rep", isShown: true },
			total: { key: "total", name: "Total", isShown: true },
			currencyName: { key: "currencyName", name: "Currency", isShown: true },
			status: { key: "status", name: "Overall Status", isShown: true },
			invoiceNumber: { key: "invoiceNumber", name: "Invoice Number", isShown: true },
			xeroStatus: { key: "xeroStatus", name: "Xero Status", isShown: true },
			template: { key: "template", name: "Template", isShown: true },
			pickingStatus: { key: "pickingStatus", name: "Picking Status", isShown: true },
			packingStatus: { key: "packingStatus", name: "Packing Status", isShown: true },
			shippingStatus: { key: "shippingStatus", name: "Shipping Status", isShown: true },
			paymentStatus: { key: "paymentStatus", name: "Payment Status", isShown: true },
		}),
		[],
	);

	const { layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useLayoutOptions(
		"orderLayoutOptions",
		layoutOptionsData,
	);

	const columns = useMemo<TableColumnData[]>(
		() => [
			{
				key: "customerName",
				label: "To",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.customerName.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.customerName.isShown}>
							{item.customerName}
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
				renderItem: (item: OrderType, column) => {
					return (
						<TableTd isOverflow key={`${column.key}-${item.id}`} isShown={layoutOptions.reference.isShown}>
							{item.reference ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "soNumber",
				label: "Sales Order",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.soNumber.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.soNumber.isShown}>
							<TableLink to={`/sales/orders/edit/${item.id}`}>{item.soNumber ?? "View Draft"}</TableLink>
						</TableTd>
					);
				},
			},
			{
				key: "soDate",
				label: "Order Date",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.soDate.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.soDate.isShown}>
							{getFormDayPickerDate(item.orderDate)}
						</TableTd>
					);
				},
			},
			{
				key: "salesRepName",
				label: "Sales Rep",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.salesRepName.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.salesRepName.isShown}>
							{item.salesRepName}
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
				renderItem: (item: OrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.total.isShown}>
							{formatNumberToCurrency(item.total)}
						</TableTd>
					);
				},
			},
			{
				key: "currencyName",
				label: "Curency",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.currencyName.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.currencyName.isShown}>
							{item.currencyCode}
						</TableTd>
					);
				},
			},
			{
				key: "status",
				label: "Overall Status",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.status.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					let color: "red" | "green" | "yellow" = "yellow";

					switch (item.overallStatus) {
						case OrderStatus.CLOSED:
							color = "green";
							break;
						case OrderStatus.VOID:
						case OrderStatus.LOST:
							color = "red";
							break;
						default:
							break;
					}
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.status.isShown}>
							<TableStatus isRed={color === "red"} isGreen={color === "green"} isYellow={color === "yellow"}>
								{orderStatusDictionary[item.overallStatus]}
							</TableStatus>
						</TableTd>
					);
				},
			},
			{
				key: "invoiceNumber",
				label: "Invoice Number",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.invoiceNumber.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.invoiceNumber.isShown}>
							{item.invoices.length
								? item.invoices.map(({ invoiceNumber }) => invoiceNumber).join("; ")
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
				renderItem: (item: OrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.xeroStatus.isShown}>
							<TableStatus>{xeroStatusDictionary[item.xeroStatus]}</TableStatus>
						</TableTd>
					);
				},
			},
			{
				key: "template",
				label: "Template",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.template.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.template.isShown} isCapitalize>
							{templateDictionary[item.template]}
						</TableTd>
					);
				},
			},
			{
				key: "pickingStatus",
				label: "Picking",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.pickingStatus.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					let color: "red" | "green" | "yellow" = "yellow";

					switch (item.pickingStatus) {
						case PickingStatus.PICKED:
							color = "green";
							break;
						case PickingStatus.AWAITING_PICK:
							color = "red";
							break;
						default:
							break;
					}

					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.pickingStatus.isShown}>
							<TableStatus isRed={color === "red"} isGreen={color === "green"} isYellow={color === "yellow"}>
								{pickingStatusDictionary[item.pickingStatus]}
							</TableStatus>
						</TableTd>
					);
				},
			},
			{
				key: "packingStatus",
				label: "Packing",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.packingStatus.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					let color: "red" | "green" | "yellow" = "yellow";

					switch (item.packingStatus) {
						case PackingStatus.PACKED:
							color = "green";
							break;
						case PackingStatus.AWAITING_PACK:
							color = "red";
							break;
						default:
							break;
					}

					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.packingStatus.isShown}>
							<TableStatus isRed={color === "red"} isGreen={color === "green"} isYellow={color === "yellow"}>
								{packingStatusDictionary[item.packingStatus]}
							</TableStatus>
						</TableTd>
					);
				},
			},
			{
				key: "shippingStatus",
				label: "Shipping",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.shippingStatus.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					let color: "red" | "green" | "yellow" = "yellow";

					switch (item.shippingStatus) {
						case ShippingStatus.SHIPPED:
							color = "green";
							break;
						case ShippingStatus.AWAITING_SHIPMENT:
							color = "red";
							break;
						default:
							break;
					}

					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.shippingStatus.isShown}>
							<TableStatus isRed={color === "red"} isGreen={color === "green"} isYellow={color === "yellow"}>
								{shippingStatusDictionary[item.shippingStatus]}
							</TableStatus>
						</TableTd>
					);
				},
			},
			{
				key: "paymentStatus",
				label: "Payment",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.paymentStatus.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: OrderType, column) => {
					let color: "red" | "green" | "yellow" = "yellow";

					switch (item.paymentStatus) {
						case PaymentStatus.PAID:
							color = "green";
							break;
						case PaymentStatus.UNPAID:
							color = "red";
							break;
						default:
							break;
					}

					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.paymentStatus.isShown}>
							<TableStatus isRed={color === "red"} isGreen={color === "green"} isYellow={color === "yellow"}>
								{paymentStatusDictionary[item.paymentStatus]}
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
