import { useMemo } from "react";

import { TableLink, TableTd, TableTh } from "@/components/widgets/Table";

import { useLayoutOptions } from "@/hooks/useLayoutOptions";

import { getFormDayPickerDate } from "@/utils/date";

import { StockAvailabilityType } from "@/@types/stockAvailability";
import { LayputOptionsData, TableColumnData } from "@/@types/utility";

export const useStockAvailabilityTable = (
	sortState: {
		productSort: string;
		locationSort: string;
		batchSort: string;
	},
	handleColumnSort: (key: "product" | "location" | "batch") => void,
) => {
	const layoutOptionsData: LayputOptionsData = useMemo(
		() => ({
			category: { key: "category", name: "Category", isShown: true },
			brand: { key: "brand", name: "Brand", isShown: true },
			product: { key: "product", name: "Product", isShown: true },
			unit: { key: "unit", name: "Unit", isShown: true },
			location: { key: "location", name: "Location", isShown: true },
			batchSerial: { key: "batchSerial", name: "Batch/Serial #", isShown: false },
			expiryDate: { key: "expiryDate", name: "Expiry Date", isShown: true },
			stockValue: { key: "stockValue", name: "Stock Value", isShown: true },
			onHand: { key: "onHand", name: "On Hand", isShown: false },
			available: { key: "available", name: "Available", isShown: false },
			onOrder: { key: "onOrder", name: "On Order", isShown: false },
			allocated: { key: "allocated", name: "Allocated", isShown: false },
			nextDelivery: { key: "nextDelivery", name: "Next Delivery", isShown: false },
		}),
		[],
	);

	const { layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useLayoutOptions(
		"stockAvailabilityLayoutOptions",
		layoutOptionsData,
	);

	const columns = useMemo<TableColumnData[]>(
		() => [
			{
				key: "category",
				label: "Category",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.category.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.category.isShown}
					>
						{item.category ?? "-"}
					</TableTd>
				),
			},
			{
				key: "brand",
				label: "Brand",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.brand.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.brand.isShown}
					>
						{item.brand ?? "-"}
					</TableTd>
				),
			},
			{
				key: "product",
				label: "Product",
				renderHeader: (item, index) => (
					<TableTh
						key={`${item.key}-${index}`}
						isShown={layoutOptions.product.isShown}
						onSortClick={() => handleColumnSort("product")}
						sortButton={
							<button type="button" aria-label={`Sort product by ${item.label}`}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use
										xlinkHref={`/icons/icons.svg#${
											sortState.productSort === "asc"
												? "up"
												: sortState.productSort === "desc"
													? "down"
													: "sort"
										}`}
									/>
								</svg>
							</button>
						}
					>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.product.isShown}
					>
						<TableLink to={`/inventory/products/edit/${item.productId}`}>{item.product}</TableLink>
					</TableTd>
				),
			},
			{
				key: "unit",
				label: "Unit",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.unit.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.unit.isShown}
					>
						{item.unit ?? "-"}
					</TableTd>
				),
			},
			{
				key: "location",
				label: "Location",
				renderHeader: (item, index) => (
					<TableTh
						key={`${item.key}-${index}`}
						isShown={layoutOptions.location.isShown}
						onSortClick={() => handleColumnSort("location")}
						sortButton={
							<button type="button" aria-label={`Sort location by ${item.label}`}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use
										xlinkHref={`/icons/icons.svg#${
											sortState.locationSort === "asc"
												? "up"
												: sortState.locationSort === "desc"
													? "down"
													: "sort"
										}`}
									/>
								</svg>
							</button>
						}
					>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.location.isShown}
					>
						{item.locationName ?? "-"}
					</TableTd>
				),
			},
			{
				key: "batchSerial",
				label: "Batch/Serial #",
				renderHeader: (item, index) => (
					<TableTh
						key={`${item.key}-${index}`}
						isShown={layoutOptions.batchSerial.isShown}
						onSortClick={() => handleColumnSort("batch")}
						sortButton={
							<button type="button" aria-label={`Sort batch by ${item.label}`}>
								<svg width="20" height="20" focusable="false" aria-hidden="true">
									<use
										xlinkHref={`/icons/icons.svg#${
											sortState.batchSort === "asc" ? "up" : sortState.batchSort === "desc" ? "down" : "sort"
										}`}
									/>
								</svg>
							</button>
						}
					>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.batchSerial.isShown}
					>
						{item.batch ?? "-"}
					</TableTd>
				),
			},
			{
				key: "expiryDate",
				label: "Expiry Date",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.expiryDate.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.expiryDate.isShown}
					>
						{item.expiryDate ? getFormDayPickerDate(item.expiryDate) : "N/A"}
					</TableTd>
				),
			},
			{
				key: "stockValue",
				label: "Stock Value",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.stockValue.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.stockValue.isShown}
					>
						{Number(item.stockValue)}
					</TableTd>
				),
			},
			{
				key: "onHand",
				label: "On Hand",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.onHand.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.onHand.isShown}
					>
						{Number(item.onHand)}
					</TableTd>
				),
			},
			{
				key: "available",
				label: "Available",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.available.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.available.isShown}
					>
						{Number(item.available)}
					</TableTd>
				),
			},
			{
				key: "onOrder",
				label: "On Order",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.onOrder.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.onOrder.isShown}
					>
						<TableLink to={`/inventory/stockAvailability/on-order/${item.productId}/${item.location}`}>
							{Number(item.onOrder)}
						</TableLink>
					</TableTd>
				),
			},
			{
				key: "allocated",
				label: "Allocated",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.allocated.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.allocated.isShown}
					>
						<TableLink to={`/inventory/stockAvailability/allocated/${item.productId}/${item.location}`}>
							{Number(item.allocated)}
						</TableLink>
					</TableTd>
				),
			},
			{
				key: "nextDelivery",
				label: "Next Delivery",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.nextDelivery.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: StockAvailabilityType, column) => (
					<TableTd
						key={`${column.key}-${item.productId}-${item.location}-${item.batch}`}
						isShown={layoutOptions.nextDelivery.isShown}
					>
						{item.nextDelivery ? getFormDayPickerDate(item.nextDelivery) : "N/A"}
					</TableTd>
				),
			},
		],
		[layoutOptions, sortState, handleColumnSort],
	);

	return {
		columns,
		layoutOptions,
		handleResetLayoutOptions,
		handleToggleLayoutOptions,
	};
};
