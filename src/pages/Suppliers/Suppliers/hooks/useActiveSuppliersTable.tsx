import { useMemo } from "react";

import { TableLink, TableTd, TableTh } from "@/components/widgets/Table";

import { useLayoutOptions } from "@/hooks/useLayoutOptions";

import { SupplierType } from "@/@types/suppliers";
import { LayputOptionsData, TableColumnData } from "@/@types/utility";

export const useActiveSuppliersTable = (sort?: string, handleSort?: () => void) => {
	const layoutOptionsData: LayputOptionsData = useMemo(
		() => ({
			name: { key: "name", name: "Supplier", isShown: true },
			accountNumber: { key: "accountNumber", name: "Account", isShown: true },
			taxNumber: { key: "taxNumber", name: "VAT Number", isShown: true },
			contactName: { key: "contactName", name: "Contact", isShown: true },
			contactEmail: { key: "contactEmail", name: "Email", isShown: true },
			currency: { key: "currency", name: "Currency", isShown: true },
		}),
		[],
	);

	const { layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useLayoutOptions(
		"activeSupplierLayoutOptions",
		layoutOptionsData,
	);

	const columns = useMemo<TableColumnData[]>(
		() => [
			{
				key: "Name",
				label: "Supplier",
				renderHeader: (item, index) => (
					<TableTh
						key={`${item.key}-${index}`}
						isShown={layoutOptions.name.isShown}
						onSortClick={handleSort}
						sortButton={
							handleSort && (
								<button className="table__sort-btn" type="button">
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use
											xlinkHref={`/icons/icons.svg#${
												sort === "asc" ? "up" : sort === "desc" ? "down" : "sort"
											}`}
										/>
									</svg>
								</button>
							)
						}
					>
						{item.label}
					</TableTh>
				),
				renderItem: (item: SupplierType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.name.isShown}>
							<TableLink to={`/purchases/suppliers/edit/${item.id}`}>{item.name}</TableLink>
						</TableTd>
					);
				},
			},
			{
				key: "Account",
				label: "Account",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.accountNumber.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: SupplierType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.accountNumber.isShown}>
							{item.accountNumber ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "VAT-Number",
				label: "VAT Number",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.taxNumber.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: SupplierType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.taxNumber.isShown}>
							{item.taxNumber ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Contact-Name",
				label: "Contact Name",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.contactName.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: SupplierType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.contactName.isShown}>
							{item.contact?.name ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Contact-Email",
				label: "Email",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.contactEmail.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: SupplierType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.contactEmail.isShown}>
							{item.contact?.email ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Currency",
				label: "Currency",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.currency.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: SupplierType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.currency.isShown}>
							{item.currency ?? "-"}
						</TableTd>
					);
				},
			},
		],
		[layoutOptions, sort, handleSort],
	);

	return {
		columns,
		layoutOptions,
		handleResetLayoutOptions,
		handleToggleLayoutOptions,
	};
};
