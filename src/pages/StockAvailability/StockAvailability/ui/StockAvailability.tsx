import { ChangeEvent, FC, useCallback } from "react";
import { useStore } from "zustand";
import { parseAsString, useQueryStates } from "nuqs";

import { useGetStockAvailability } from "../api/useGetStockAvailability";
import { useStockAvailabilityTable } from "../hooks/useStockAvailabilityTable";

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

const SalesAvailability: FC = () => {
	const { orgId } = useStore(orgStore);

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
		productSort: parseAsString.withDefault("no_sort"),
		locationSort: parseAsString.withDefault("no_sort"),
		batchSort: parseAsString.withDefault("no_sort"),
	});

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { data, error, isLoading, isError, isSuccess } = useGetStockAvailability({
		organisationId: orgId,
		pageNumber: queryParams.p,
		pageSize: queryParams.l,
		searchValue,
		...(queryParams.productSort !== "no_sort" && { productSort: queryParams.productSort as "asc" | "desc" }),
		...(queryParams.locationSort !== "no_sort" && {
			locationSort: queryParams.locationSort as "asc" | "desc",
		}),
		...(queryParams.batchSort !== "no_sort" && { batchSort: queryParams.batchSort as "asc" | "desc" }),
	});

	const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setQueryParams((prev) => ({ ...prev, q: event.target.value }));
	};

	const handlePageAndLimit = (p: string, l: string) => {
		setQueryParams((prev) => ({ ...prev, p: p, l: l }));
	};

	const handleColumnSort = (columnKey: "product" | "location" | "batch") => {
		const current = queryParams[`${columnKey}Sort`];

		const nextState = current === "no_sort" ? "asc" : current === "asc" ? "desc" : "no_sort";

		setQueryParams({
			productSort: columnKey === "product" ? nextState : "no_sort",
			locationSort: columnKey === "location" ? nextState : "no_sort",
			batchSort: columnKey === "batch" ? nextState : "no_sort",
			p: "1",
		});
	};

	const { columns, layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } =
		useStockAvailabilityTable(
			{
				productSort: queryParams.productSort,
				locationSort: queryParams.locationSort,
				batchSort: queryParams.batchSort,
			},
			handleColumnSort,
		);

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
							<CommonPageTitle>Stock Availability</CommonPageTitle>
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
											{data.data.data.length > 0 ? (
												<>
													{data.data.data.map((item, index) => (
														<TableTr key={`${item.productId}-${item.location}-${item.batch}-${index}`}>
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

export default SalesAvailability;
