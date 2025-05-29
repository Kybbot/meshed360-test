import { ChangeEvent, FC, useCallback } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";
import { parseAsString, useQueryStates } from "nuqs";

import { useGetAllPurchaseOrders } from "../api/queries/useGetAllPurchaseOrders";

import { useOrdersTable } from "../hooks/useOrdersTable";

import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	CommonPage,
	CommonPageActions,
	CommonPageHeader,
	CommonPageMain,
	CommonPageTitle,
} from "@/components/widgets/Page";
import {
	Table,
	TableEmpty,
	TablePagination,
	TableTbody,
	TableThead,
	TableTr,
} from "@/components/widgets/Table";
import { Search } from "@/components/widgets/Search";
import { LayoutOptions } from "@/components/widgets/LayoutOptions";

import { orgStore } from "@/app/stores/orgStore";

import { useDebounce } from "@/hooks/useDebounce";

const PurchaseOrders: FC = () => {
	const { orgId } = useStore(orgStore);

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
	});

	const { columns, layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useOrdersTable();

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { data, error, isLoading, isError, isSuccess } = useGetAllPurchaseOrders({
		organisationId: orgId,
		pageNumber: queryParams.p,
		pageSize: queryParams.l,
		searchValue,
	});

	const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setQueryParams((prev) => ({ ...prev, q: event.target.value }));
	};

	const handlePageAndLimit = (p: string, l: string) => {
		setQueryParams((prev) => ({ ...prev, p: p, l: l }));
	};

	return (
		<CommonPage>
			<div className="main__container">
				{isLoading ? (
					<Loader isFullWidth />
				) : isError && error ? (
					<ErrorMessage error={error} />
				) : isSuccess && data.data ? (
					<>
						<CommonPageHeader>
							<CommonPageTitle>Purchase Orders</CommonPageTitle>
							<CommonPageActions>
								<Search
									id="searchId"
									name="search"
									label="Search"
									value={queryParams.q}
									onChange={handleChangeSearch}
								/>
								<LayoutOptions
									data={layoutOptions}
									handleReset={handleResetLayoutOptions}
									handleToggle={handleToggleLayoutOptions}
								/>
								<Link to="/purchases/orders/new" className="link">
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#plus" />
									</svg>
									Add
								</Link>
							</CommonPageActions>
						</CommonPageHeader>
						<CommonPageMain>
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
											{data.data.items.length > 0 ? (
												<>
													{data.data.items.map((item) => (
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
								<TablePagination
									page={queryParams.p}
									limit={queryParams.l}
									total={data.data.totalCount}
									totalPages={data.data.totalPages}
									handlePageAndLimit={handlePageAndLimit}
								/>
							</div>
						</CommonPageMain>
					</>
				) : (
					<p className="empty_list">No data available</p>
				)}
			</div>
		</CommonPage>
	);
};

export default PurchaseOrders;
