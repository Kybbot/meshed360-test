import { ChangeEvent, FC } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";

import { useActiveCustomersTable } from "../hooks/useActiveProductsTable";

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
import { GetAllProductsResponseType } from "@/@types/products";

type ActiveCustomersProps = {
	page: string;
	limit: string;
	search: string;
	data: ApiResult<GetAllProductsResponseType>;
	handlePageAndLimit: (p: string, l: string) => void;
	handleChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const ActiveProducts: FC<ActiveCustomersProps> = ({
	data,
	page,
	limit,
	search,
	handlePageAndLimit,
	handleChangeSearch,
}) => {
	const { orgId } = useStore(orgStore);

	const { columns, layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } =
		useActiveCustomersTable();

	const { isLoadingExportData: isProductDataFetching, getExportData: getProductsCsvData } = useGetExportData(
		"ProductsData",
		orgId,
	);

	const handleDownloadProductsData = async () => {
		await getProductsCsvData();
	};

	return (
		<div>
			<div className="activeCustomers__actions">
				<Search id="searchId" name="search" label="Search" value={search} onChange={handleChangeSearch} />
				<LayoutOptions
					data={layoutOptions}
					handleReset={handleResetLayoutOptions}
					handleToggle={handleToggleLayoutOptions}
				/>
				<Button
					isSecondary
					type="button"
					disabled={isProductDataFetching}
					onClick={handleDownloadProductsData}
					isUseSpinner={isProductDataFetching}
				>
					{isProductDataFetching ? (
						<Spinner />
					) : (
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#export" />
						</svg>
					)}
					Export
				</Button>
				<Link to="/inventory/products/import" className="link link--secondary">
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#import" />
					</svg>
					Import
				</Link>
				<Link to="/inventory/products/new" className="link">
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
								{data.data.allProducts.length > 0 ? (
									<>
										{data.data.allProducts.map((item) => (
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
