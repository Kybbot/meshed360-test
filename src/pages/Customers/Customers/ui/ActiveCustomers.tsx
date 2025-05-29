import { ChangeEvent, FC } from "react";
import { useStore } from "zustand";
import { Link, useNavigate } from "react-router";

import { useActiveCustomersTable } from "../hooks/useActiveCustomersTable";

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
import { GetAllCustomersResponseType } from "@/@types/customers";

type ActiveCustomersProps = {
	page: string;
	limit: string;
	sort?: string;
	search: string;
	handleSort?: () => void;
	data: ApiResult<GetAllCustomersResponseType>;
	handlePageAndLimit: (p: string, l: string) => void;
	handleChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const ActiveCustomers: FC<ActiveCustomersProps> = ({
	data,
	page,
	limit,
	sort,
	search,
	handleSort,
	handlePageAndLimit,
	handleChangeSearch,
}) => {
	const navigate = useNavigate();
	const { orgId } = useStore(orgStore);

	const { columns, layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } =
		useActiveCustomersTable(sort, handleSort);

	const { isLoadingExportData: isCustomersDataFetching, getExportData: getCustomersCsvData } =
		useGetExportData("CustomersData", orgId);
	const { isLoadingExportData: isContactDataFetching, getExportData: getCustomerContactsCsvData } =
		useGetExportData("CustomerContactsData", orgId);
	const { isLoadingExportData: isAddressesDataFetching, getExportData: getCustomerAddressesCsvData } =
		useGetExportData("CustomerAddressesData", orgId);

	const handleDownloadCustomersData = async () => {
		await getCustomersCsvData();
	};

	const handleDownloadContactsData = async () => {
		await getCustomerContactsCsvData();
	};

	const handleDownloadAddressesData = async () => {
		await getCustomerAddressesCsvData();
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
							disabled={isAddressesDataFetching || isCustomersDataFetching || isContactDataFetching}
							isUseSpinner={isAddressesDataFetching || isCustomersDataFetching || isContactDataFetching}
						>
							{isAddressesDataFetching || isCustomersDataFetching || isContactDataFetching ? (
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
							Export Customer(s)
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
							onClick={() => navigate("/sales/customers/import/customers")}
						>
							Import Customers
						</DropdownMenuItem>
						<DropdownMenuItem
							className="dropDown__item"
							onClick={() => navigate("/sales/customers/import/addresses")}
						>
							Import Addresses
						</DropdownMenuItem>
						<DropdownMenuItem
							className="dropDown__item"
							onClick={() => navigate("/sales/customers/import/contacts")}
						>
							Import Contacts
						</DropdownMenuItem>
					</DropdownMenu>
				</DropdownMenuRoot>
				<Link to="/sales/customers/new" className="link">
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#plus" />
					</svg>
					Add
				</Link>
				{/* <DropdownMenuRoot modal={false}>
					<DropdownMenuTrigger asChild>
						<Button type="button">
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#plus" />
							</svg>
							Add
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
						<DropdownMenuItem className="dropDown__item" onClick={() => navigate("/sales/customers/new")}>
							Manually
						</DropdownMenuItem>
						<DropdownMenuItem className="dropDown__item" onClick={() => navigate("/")}>
							Onboarding
						</DropdownMenuItem>
					</DropdownMenu>
				</DropdownMenuRoot> */}
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
								{data.data.customers.length > 0 ? (
									<>
										{data.data.customers.map((item) => (
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
