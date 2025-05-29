import { useEffect, useMemo } from "react";

import { useReportsLayoutOptions } from "./useReportsLayoutOptions";

import { TableTd, TableTh } from "@/components/widgets/Table";

import { TableColumnData } from "@/@types/utility";

export type ReportsLayoutOptionsTypes =
	| "invoicesCreditLayoutOptions"
	| "salesByProductsLayoutOptions"
	| "profitBySalesRepresentativeLayoutOptions"
	| "purchaseOrderDetailsLayoutOptions"
	| "purchaseOrderVsInvoiceLayoutOptions"
	| "stockReceivedVsInvoicedLayoutOptions"
	| "purchaseCostAnalysisLayoutOptions"
	| "productStockLevelLayoutOptions"
	| "inventoryMovementDetailsLayoutOptions";

export const useReportsTable = (headers: string[], layoutOptionsName: ReportsLayoutOptionsTypes) => {
	const layoutOptionsData = useMemo(
		() =>
			headers.reduce((acc, item) => {
				const nameVal = item;
				const keyString = item.replaceAll(" ", "").toLowerCase();

				const option = {
					[keyString]: {
						key: keyString,
						name: nameVal,
						isShown: true,
					},
				};

				const updated = { ...acc, ...option };
				return updated;
			}, {}),
		[headers],
	);

	const { layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useReportsLayoutOptions(
		layoutOptionsName,
		layoutOptionsData,
	);

	const columns = useMemo<TableColumnData[]>(() => {
		return headers.map((header, i) => ({
			key: header.toLowerCase().replaceAll(" ", ""),
			label: header,
			renderHeader: (item, index) => (
				<TableTh
					key={`${item.key}-${index}`}
					style={{ minWidth: "120px" }}
					isShown={layoutOptions?.[item.key]?.isShown}
				>
					{item.label}
				</TableTh>
			),
			renderItem: (item: string[], column) => {
				return (
					<TableTd key={`${column.key}`} isShown={layoutOptions?.[column.key]?.isShown}>
						{item[i]}
					</TableTd>
				);
			},
		}));
	}, [layoutOptions, headers]);

	useEffect(() => {
		const layoutOptionsKeys = Object.keys(layoutOptions).length;
		const layoutOptionsDataKeys = Object.keys(layoutOptionsData).length;

		if (!Object.keys(layoutOptions).length && Object.keys(layoutOptionsData).length > 0) {
			handleResetLayoutOptions();
		}

		if (
			layoutOptionsKeys > 0 &&
			layoutOptionsDataKeys > 0 &&
			(layoutOptionsKeys < layoutOptionsDataKeys || layoutOptionsKeys > layoutOptionsDataKeys)
		) {
			handleResetLayoutOptions();
		}
	}, [layoutOptions, layoutOptionsData, handleResetLayoutOptions]);

	return {
		columns,
		layoutOptions,
		handleResetLayoutOptions,
		handleToggleLayoutOptions,
	};
};
