import { useMemo } from "react";

import { TableLink, TableTd, TableTh } from "@/components/widgets/Table";

import { useLayoutOptions } from "@/hooks/useLayoutOptions";

import { BOMValues, ProductType } from "@/@types/products";
import { LayputOptionsData, TableColumnData } from "@/@types/utility";

export const useActiveCustomersTable = () => {
	const layoutOptionsData: LayputOptionsData = useMemo(
		() => ({
			sku: { key: "sku", name: "SKU", isShown: true },
			name: { key: "name", name: "Item Name", isShown: true },
			type: { key: "type", name: "Type", isShown: true },
			unitOfMeasure: { key: "unitOfMeasure", name: "UOM", isShown: true },
			category: { key: "category", name: "Category", isShown: true },
			brand: { key: "brand", name: "Brand", isShown: true },
			barcode: { key: "barcode", name: "Barcode", isShown: true },
			bom: { key: "bom", name: "BOM Type", isShown: true },
		}),
		[],
	);

	const { layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useLayoutOptions(
		"activeProductLayoutOptions",
		layoutOptionsData,
	);

	const columns = useMemo<TableColumnData[]>(
		() => [
			{
				key: "Sku",
				label: "SKU",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.sku.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: ProductType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.sku.isShown}>
							<TableLink to={`/inventory/products/edit/${item.id}`}>{item.sku}</TableLink>
						</TableTd>
					);
				},
			},
			{
				key: "Name",
				label: "Item Name",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.name.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: ProductType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.name.isShown}>
							<TableLink to={`/inventory/products/edit/${item.id}`}>{item.name}</TableLink>
						</TableTd>
					);
				},
			},
			{
				key: "Type",
				label: "Type",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.type.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: ProductType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.type.isShown} isCapitalize>
							{item.type.toLocaleLowerCase()}
						</TableTd>
					);
				},
			},
			{
				key: "UOM",
				label: "UOM",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.unitOfMeasure.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: ProductType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.unitOfMeasure.isShown}>
							{item.unitOfMeasure?.name ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Category",
				label: "Category",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.category.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: ProductType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.category.isShown}>
							{item.category ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Brand",
				label: "Brand",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.brand.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: ProductType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.brand.isShown}>
							{item.brand ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Barcode",
				label: "Barcode",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.barcode.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: ProductType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.barcode.isShown}>
							{item.barcode ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "BOM Type",
				label: "BOM Type",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.bom.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: ProductType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.bom.isShown}>
							{BOMValues[item.bomType] ?? "-"}
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
