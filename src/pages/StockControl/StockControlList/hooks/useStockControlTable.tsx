import { useMemo } from "react";

import { TableLink, TableStatus, TableTd, TableTh } from "@/components/widgets/Table";

import { useLayoutOptions } from "@/hooks/useLayoutOptions";

import { getFormDayPickerDate } from "@/utils/date";

import {
	StockControlType,
	StockControlTypes,
	StockControlRoutes,
	StockControlStatuses,
} from "@/@types/stockControl";
import { LayputOptionsData, TableColumnData } from "@/@types/utility";

export const useStockControlTable = () => {
	const layoutOptionsData: LayputOptionsData = useMemo(
		() => ({
			number: { key: "number", name: "Number", isShown: true },
			type: { key: "type", name: "Type", isShown: true },
			sourceLocation: { key: "sourceLocation", name: "Source", isShown: true },
			destinationLocation: { key: "destinationLocation", name: "Destination", isShown: true },
			date: { key: "date", name: "Date", isShown: true },
			status: { key: "status", name: "Status", isShown: true },
			createdBy: { key: "createdBy", name: "Created By", isShown: true },
			reference: { key: "reference", name: "Reference", isShown: true },
		}),
		[],
	);

	const { layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useLayoutOptions(
		"stockControlLayoutOptions",
		layoutOptionsData,
	);

	const columns = useMemo<TableColumnData[]>(
		() => [
			{
				key: "number",
				label: "Number",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.number.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockControlType, column) => {
					const route = StockControlRoutes[item.type];
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.number.isShown}>
							<TableLink to={`/inventory/${route}/edit/${item.id}`}>
								{item.number ??
									(item.status === "DRAFT"
										? "View Draft"
										: item.status === "IN_PROGRESS"
											? "View In Progress"
											: "-")}
							</TableLink>
						</TableTd>
					);
				},
			},
			{
				key: "type",
				label: "Type",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.type.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockControlType, column) => (
					<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.type.isShown}>
						{StockControlTypes[item.type]}
					</TableTd>
				),
			},
			{
				key: "source",
				label: "Source",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.sourceLocation.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockControlType, column) => (
					<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.sourceLocation.isShown}>
						{item.sourceLocation}
					</TableTd>
				),
			},
			{
				key: "destination",
				label: "Destination",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.destinationLocation.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockControlType, column) => (
					<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.destinationLocation.isShown}>
						{item.destinationLocation ?? "-"}
					</TableTd>
				),
			},
			{
				key: "date",
				label: "Date",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.date.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockControlType, column) => (
					<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.date.isShown}>
						{getFormDayPickerDate(item.date)}
					</TableTd>
				),
			},
			{
				key: "status",
				label: "Status",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.status.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockControlType, column) => (
					<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.status.isShown}>
						<TableStatus
							isGreen={item.status === "COMPLETED"}
							isYellow={item.status === "DRAFT" || item.status === "IN_PROGRESS"}
						>
							{StockControlStatuses[item.status]}
						</TableStatus>
					</TableTd>
				),
			},
			{
				key: "createdBy",
				label: "Created By",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.createdBy.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockControlType, column) => (
					<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.createdBy.isShown}>
						{item.createdBy}
					</TableTd>
				),
			},
			{
				key: "reference",
				label: "Reference",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.reference.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockControlType, column) => (
					<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.reference.isShown}>
						{item.reference ?? "-"}
					</TableTd>
				),
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
