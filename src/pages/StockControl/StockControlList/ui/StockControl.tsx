import { ChangeEvent, FC, useCallback } from "react";
import { useNavigate } from "react-router";
import { useStore } from "zustand";
import { parseAsString, useQueryStates } from "nuqs";

import { useGetStockControlList } from "../api/queries/useGetStockControlList";
import { useStockControlTable } from "../hooks/useStockControlTable";

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

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Button } from "@/components/shared/Button";

import { orgStore } from "@/app/stores/orgStore";
import { useDebounce } from "@/hooks/useDebounce";

const StockControl: FC = () => {
	const { orgId } = useStore(orgStore);
	const navigate = useNavigate();

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
	});

	const { columns, layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } =
		useStockControlTable();

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { data, error, isLoading, isError, isSuccess } = useGetStockControlList({
		organisationId: orgId,
		pageNumber: queryParams.p,
		pageSize: queryParams.l,
		searchValue,
	});

	const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setQueryParams((prev) => ({ ...prev, q: event.target.value }));
	};

	const handlePageAndLimit = (p: string, l: string) => {
		setQueryParams((prev) => ({ ...prev, p, l }));
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
							<CommonPageTitle>Stock Control List</CommonPageTitle>
							<CommonPageActions>
								<Search
									id="stock-search"
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
								<DropdownMenuRoot modal={false}>
									<DropdownMenuTrigger asChild>
										<Button type="button">
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#plus" />
											</svg>
											Add
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
										<DropdownMenuItem
											className="dropDown__item"
											onClick={() => navigate("/inventory/stockTake/new")}
										>
											Stock Take
										</DropdownMenuItem>
										<DropdownMenuItem
											className="dropDown__item"
											onClick={() => navigate("/inventory/stockTransfer/new")}
										>
											Stock Transfer
										</DropdownMenuItem>
										<DropdownMenuItem
											className="dropDown__item"
											onClick={() => navigate("/inventory/stockAdjustment/new")}
										>
											Stock Adjustment
										</DropdownMenuItem>
									</DropdownMenu>
								</DropdownMenuRoot>
							</CommonPageActions>
						</CommonPageHeader>
						<CommonPageMain>
							<div className="customTable">
								<div className="customTable__wrapper">
									<Table>
										<TableThead>
											<TableTr>{columns.map((column, index) => column.renderHeader(column, index))}</TableTr>
										</TableThead>
										<TableTbody>
											{data.data.items.length > 0 ? (
												data.data.items.map((item) => (
													<TableTr key={item.id}>
														{columns.map((column) => column.renderItem(item, column))}
													</TableTr>
												))
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

export default StockControl;
