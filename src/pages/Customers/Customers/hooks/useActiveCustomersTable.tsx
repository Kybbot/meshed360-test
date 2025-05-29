import { useMemo } from "react";

import { TableLink, TableTd, TableTh } from "@/components/widgets/Table";

import { useLayoutOptions } from "@/hooks/useLayoutOptions";

import { formatNumberToCurrency } from "@/utils/formatNumberToCurrency";

import { CustomerType } from "@/@types/customers";
import { LayputOptionsData, TableColumnData } from "@/@types/utility";

export const useActiveCustomersTable = (sort?: string, handleSort?: () => void) => {
	const layoutOptionsData: LayputOptionsData = useMemo(
		() => ({
			name: { key: "name", name: "Name", isShown: true },
			account: { key: "account", name: "Account", isShown: true },
			vatNumber: { key: "vatNumber", name: "VAT Number", isShown: true },
			"contact.name": { key: "contact.name", name: "Contact", isShown: true },
			"contact.phone": { key: "contact.phone", name: "Contact Number", isShown: true },
			"contact.email": { key: "contact.email", name: "Email", isShown: true },
			address: { key: "address", name: "Address", isShown: true },
			currency: { key: "currency", name: "Currency", isShown: true },
			salesRep: { key: "salesRep", name: "Sales Rep", isShown: true },
			dueAmount: { key: "dueAmount", name: "Due Amount", isShown: true },
			creditLimit: { key: "creditLimit", name: "Credit Limit", isShown: true },
		}),
		[],
	);

	const { layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useLayoutOptions(
		"activeCustomersLayoutOptions",
		layoutOptionsData,
	);

	const columns = useMemo<TableColumnData[]>(
		() => [
			{
				key: "Name",
				label: "Name",
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
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.name.isShown}>
							<TableLink to={`/sales/customers/edit/${item.id}`}>{item.name}</TableLink>
						</TableTd>
					);
				},
			},
			{
				key: "Account",
				label: "Account",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.account.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.account.isShown}>
							{item.account}
						</TableTd>
					);
				},
			},
			{
				key: "VAT Number",
				label: "VAT Number",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.vatNumber.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.vatNumber.isShown}>
							{item.vatNumber ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Contact",
				label: "Contact",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions["contact.name"].isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions["contact.name"].isShown}>
							{item.contact.name ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Contact Number",
				label: "Contact Number",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions["contact.phone"].isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions["contact.phone"].isShown}>
							{item.contact.phone ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Email",
				label: "Email",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions["contact.email"].isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions["contact.email"].isShown}>
							{item.contact.email ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Address",
				label: "Address",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.address.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.address.isShown}>
							{item.address ?? "-"}
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
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.currency.isShown}>
							{item.currency ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Sales Rep",
				label: "Sales Rep",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.salesRep.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.salesRep.isShown}>
							{item.salesRep ?? "-"}
						</TableTd>
					);
				},
			},
			{
				key: "Due Amount",
				label: "Due Amount",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.dueAmount.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.dueAmount.isShown}>
							{formatNumberToCurrency(item.dueAmount)}
						</TableTd>
					);
				},
			},
			{
				key: "Credit Limit",
				label: "Credit Limit",
				renderHeader: (item, index) => (
					<TableTh key={`${item.key}-${index}`} isShown={layoutOptions.creditLimit.isShown}>
						{item.label}
					</TableTh>
				),
				renderItem: (item: CustomerType, column) => {
					return (
						<TableTd key={`${column.key}-${item.id}`} isShown={layoutOptions.creditLimit.isShown}>
							{formatNumberToCurrency(item.creditLimit)}
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
