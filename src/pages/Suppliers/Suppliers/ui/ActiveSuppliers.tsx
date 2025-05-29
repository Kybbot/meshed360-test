import { ChangeEvent, FC } from "react";
import { useStore } from "zustand";
import { Link, useNavigate } from "react-router";

import { useActiveSuppliersTable } from "../hooks/useActiveSuppliersTable";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Button } from "@/components/shared/Button";
import { Search } from "@/components/widgets/Search";
import { Spinner } from "@/components/shared/Spinner";

import {
	Table,
	TableEmpty,
	TablePagination,
	TableTbody,
	TableThead,
	TableTr,
} from "@/components/widgets/Table";
import { LayoutOptions } from "@/components/widgets/LayoutOptions";

import { orgStore } from "@/app/stores/orgStore";

import { useGetExportData } from "@/hooks/useGetCsvData";

import { ApiResult } from "@/@types/api";
import { GetAllSuppliersResponseType } from "@/@types/suppliers";

type ActiveCustomersProps = {
	page: string;
	limit: string;
	sort?: string;
	search: string;
	data: ApiResult<GetAllSuppliersResponseType>;
	handleSort?: () => void;
	handlePageAndLimit: (p: string, l: string) => void;
	handleChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const ActiveSuppliers: FC<ActiveCustomersProps> = ({
	data,
	page,
	sort,
	limit,
	search,
	handleSort,
	handlePageAndLimit,
	handleChangeSearch,
}) => {
	const navigate = useNavigate();
	const { orgId } = useStore(orgStore);

	const { columns, layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } =
		useActiveSuppliersTable(sort, handleSort);

	const { isLoadingExportData: isSuppliersDataFetching, getExportData: getSuppliersCsvData } =
		useGetExportData("SuppliersData", orgId);
	const { isLoadingExportData: isContactDataFetching, getExportData: getSupplierContactsCsvData } =
		useGetExportData("SupplierContactsData", orgId);
	const { isLoadingExportData: isAddressesDataFetching, getExportData: getSupplierAddressesCsvData } =
		useGetExportData("SupplierAddressesData", orgId);

	const handleDownloadCustomersData = async () => {
		await getSuppliersCsvData();
	};

	const handleDownloadContactsData = async () => {
		await getSupplierContactsCsvData();
	};

	const handleDownloadAddressesData = async () => {
		await getSupplierAddressesCsvData();
	};

	return (
		<div className="activeCustomers">
			<div className="activeCustomers__actions">
				<Search id="searchId" name="search" label="Search" value={search} onChange={handleChangeSearch} />
				<LayoutOptions
					data={layoutOptions}
					handleReset={handleResetLayoutOptions}
					handleToggle={handleToggleLayoutOptions}
				/>
				<DropdownMenuRoot modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							isSecondary
							disabled={isAddressesDataFetching || isSuppliersDataFetching || isContactDataFetching}
							isUseSpinner={isAddressesDataFetching || isSuppliersDataFetching || isContactDataFetching}
						>
							{isAddressesDataFetching || isSuppliersDataFetching || isContactDataFetching ? (
								<Spinner />
							) : (
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#export" />
								</svg>
							)}
							Export
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
						<DropdownMenuItem className="dropDown__item" onClick={handleDownloadCustomersData}>
							Export Supplier(s)
						</DropdownMenuItem>
						<DropdownMenuItem className="dropDown__item" onClick={handleDownloadAddressesData}>
							Export Addresses
						</DropdownMenuItem>
						<DropdownMenuItem className="dropDown__item" onClick={handleDownloadContactsData}>
							Export Contacts
						</DropdownMenuItem>
					</DropdownMenu>
				</DropdownMenuRoot>
				<DropdownMenuRoot modal={false}>
					<DropdownMenuTrigger asChild>
						<Button type="button" isSecondary>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#import" />
							</svg>
							Import
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
						<DropdownMenuItem
							className="dropDown__item"
							onClick={() => navigate("/purchases/suppliers/import/suppliers")}
						>
							Import Suppliers
						</DropdownMenuItem>
						<DropdownMenuItem
							className="dropDown__item"
							onClick={() => navigate("/purchases/suppliers/import/addresses")}
						>
							Import Addresses
						</DropdownMenuItem>
						<DropdownMenuItem
							className="dropDown__item"
							onClick={() => navigate("/purchases/suppliers/import/contacts")}
						>
							Import Contacts
						</DropdownMenuItem>
					</DropdownMenu>
				</DropdownMenuRoot>
				<Link to="/purchases/suppliers/new" className="link">
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#plus" />
					</svg>
					Add
				</Link>
			</div>
			<div className="activeCustomers__main">
				<div className="customTable">
					<div className="customTable__wrapper">
						<Table>
							<TableThead>
								<TableTr>
									{columns.map((column, index) => {
										return column.renderHeader(column, index);
									})}
								</TableTr>
							</TableThead>
							<TableTbody>
								{data.data.suppliers.length > 0 ? (
									<>
										{data.data.suppliers.map((item) => (
											<TableTr key={item.id}>
												{columns.map((column) => {
													return column.renderItem(item, column);
												})}
											</TableTr>
										))}
									</>
								) : (
									<TableEmpty colSpan={columns.length} />
								)}
							</TableTbody>
						</Table>
					</div>
				</div>
				<TablePagination
					page={page}
					limit={limit}
					total={data.data.totalCount}
					totalPages={data.data.totalPages}
					handlePageAndLimit={handlePageAndLimit}
				/>
			</div>
		</div>
	);
};
