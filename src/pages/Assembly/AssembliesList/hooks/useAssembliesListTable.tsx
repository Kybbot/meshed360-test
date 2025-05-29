import { useMemo } from "react";

import { TableLink, TableStatus, TableTd, TableTh } from "@/components/widgets/Table";

import { useLayoutOptions } from "@/hooks/useLayoutOptions";

import { getFormDayPickerDate } from "@/utils/date";
import { formatNumberToCurrency } from "@/utils/formatNumberToCurrency";

import { LayputOptionsData, TableColumnData } from "@/@types/utility";
import { AssemblyListType, AssemblyStatuses } from "@/@types/assembly/assembly";

export const useAssembliesListTable = () => {
	const layoutOptionsData: LayputOptionsData = useMemo(
		() => ({
			assemblyNumber: { key: "assemblyNumber", name: "Assembly Number", isShown: true },
			batchNumber: { key: "batchNumber", name: "Batch Number", isShown: true },
			expiryDate: { key: "expiryDate", name: "Expiry Date", isShown: true },
			product: { key: "product", name: "Product", isShown: true },
			quantity: { key: "quantity", name: "Quantity", isShown: true },
			warehouse: { key: "warehouse", name: "Warehouse", isShown: true },
			date: { key: "date", name: "Date", isShown: true },
			status: { key: "status", name: "Status", isShown: true },
			totalCost: { key: "totalCost", name: "Total Cost", isShown: true },
			notes: { key: "notes", name: "Notes", isShown: true },
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
				key: "assemblyNumber",
				label: "Assembly Number",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.assemblyNumber.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: AssemblyListType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.assemblyNumber.isShown}>
							<TableLink to={`/production/assembly/edit/${item.id}`}>
								{item.assemblyNumber ?? "View Draft"}
							</TableLink>
						</TableTd>
					);
				},
			},
			{
				key: "batchNumber",
				label: "Batch Number",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.batchNumber.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: AssemblyListType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.batchNumber.isShown}>
							{item.batchNumber ?? "N/A"}
						</TableTd>
					);
				},
			},
			{
				key: "expiryDate",
				label: "Expiry Date",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.expiryDate.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: AssemblyListType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.expiryDate.isShown}>
							{item.expiryDate ? getFormDayPickerDate(item.expiryDate) : "-"}
						</TableTd>
					);
				},
			},
			{
				key: "product",
				label: "Product",
				renderHeader: (item, index) => (
					<TableTh
						style={{ width: "14%" }}
						key={`${item.key}-${index}`}
						isShown={layoutOptions.product.isShown}
					>
						{item.label}
					</TableTh>
				),
				renderItem: (item: AssemblyListType, column) => {
					return (
						<TableTd isOverflow key={`${column.key}-${item.id}`} isShown={layoutOptions.product.isShown}>
							{item.product.sku}:{item.product.name}
						</TableTd>
					);
				},
			},
			{
				key: "quantity",
				label: "Quantity",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.quantity.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: AssemblyListType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.quantity.isShown}>
							{item.quantity}
						</TableTd>
					);
				},
			},
			{
				key: "warehouse",
				label: "Location",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.warehouse.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: AssemblyListType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.warehouse.isShown}>
							{item.warehouse.name}
						</TableTd>
					);
				},
			},
			{
				key: "date",
				label: "Date",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.date.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: AssemblyListType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.date.isShown}>
							{getFormDayPickerDate(item.date)}
						</TableTd>
					);
				},
			},
			{
				key: "status",
				label: "Status",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.status.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: AssemblyListType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.status.isShown}>
							<TableStatus isGreen={item.status === "CLOSED"} isYellow={item.status !== "CLOSED"}>
								{AssemblyStatuses[item.status]}
							</TableStatus>
						</TableTd>
					);
				},
			},
			{
				key: "totalCost",
				label: "Total Cost",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.totalCost.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: AssemblyListType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.totalCost.isShown}>
							{formatNumberToCurrency(item.totalCost)}
						</TableTd>
					);
				},
			},
			{
				key: "notes",
				label: "Notes",
				renderHeader: (item, index) => (
					<TableTh
						style={{ width: "10%" }}
						key={`${item.key}-${index}`}
						isShown={layoutOptions.notes.isShown}
					>
						{item.label}
					</TableTh>
				),
				renderItem: (item: AssemblyListType, column) => {
					return (
						<TableTd isOverflow key={`${column.key}-${item.id}`} isShown={layoutOptions.notes.isShown}>
							{item.notes}
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
