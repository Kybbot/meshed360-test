import { useMemo } from "react";

import { TableLink, TableTd, TableTh } from "@/components/widgets/Table";

import { useLayoutOptions } from "@/hooks/useLayoutOptions";

import { SupplierType } from "@/@types/suppliers";
import { LayputOptionsData, TableColumnData } from "@/@types/utility";

export const useDraftsTable = () => {
	const layoutOptionsData: LayputOptionsData = useMemo(
		() => ({
			name: { key: "name", name: "Name", isShown: true },
			reportDate: { key: "reportDate", name: "Report Date", isShown: true },
			author: { key: "author", name: "Author", isShown: true },
			datePublished: { key: "datePublished", name: "Date Published", isShown: true },
		}),
		[],
	);

	const { layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useLayoutOptions(
		"activeSupplierLayoutOptions", // TO DO
		layoutOptionsData,
	);

	const columns = useMemo<TableColumnData[]>(
		() => [
			{
				key: "Name",
				label: "Name",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions?.name?.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: SupplierType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions?.name?.isShown}>
							<TableLink to={`/purchases/suppliers/edit/${item.id}`}>{item.name}</TableLink>
						</TableTd>
					);
				},
			},
			{
				key: "Report-Date",
				label: "Report Date",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions?.accountNumber?.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: SupplierType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions?.accountNumber?.isShown}>
							{item.accountNumber ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Author",
				label: "Author",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions?.taxNumber?.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: SupplierType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions?.taxNumber?.isShown}>
							{item.taxNumber ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Date-Published",
				label: "Date Published",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions?.contactName?.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: SupplierType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions?.contactName?.isShown}>
							{item.contact?.name ?? "-"}
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
