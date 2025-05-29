import { ChangeEvent, FC, useCallback } from "react";
import { Link, useParams } from "react-router";
import { useStore } from "zustand";
import { parseAsString, useQueryStates } from "nuqs";

import { useGetAllocatedDetails } from "../api/useGetAllocatedDetails";

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
	TableThead,
	TableTbody,
	TableTr,
	TableTh,
	TableTd,
	TableEmpty,
	TablePagination,
	TableLink,
} from "@/components/widgets/Table";
import { Search } from "@/components/widgets/Search";

import { orgStore } from "@/app/stores/orgStore";

import { useDebounce } from "@/hooks/useDebounce";

import { getFormDayPickerDate } from "@/utils/date";

const AllocatedDetails: FC = () => {
	const { orgId } = useStore(orgStore);
	const { productId, locationId } = useParams();

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
	});

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { data, error, isLoading, isError, isSuccess } = useGetAllocatedDetails({
		organisationId: orgId,
		productId,
		warehouseId: locationId,
		searchValue,
		pageNumber: queryParams.p,
		pageSize: queryParams.l,
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
							<CommonPageTitle>Allocated Details</CommonPageTitle>
							<CommonPageActions>
								<Search
									id="searchAllocated"
									name="search"
									label="Search"
									value={queryParams.q}
									onChange={handleChangeSearch}
								/>
								<Link to="/inventory/stockAvailability" className="link link--secondary">
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#list" />
									</svg>
									Back to List
								</Link>
							</CommonPageActions>
						</CommonPageHeader>
						<CommonPageMain>
							<div className="customTable">
								<div className="customTable__wrapper">
									<Table>
										<TableThead>
											<TableTr>
												<TableTh>Sales Order Number</TableTh>
												<TableTh>Customer</TableTh>
												<TableTh>Effective Date</TableTh>
												<TableTh>Quantity</TableTh>
											</TableTr>
										</TableThead>
										<TableTbody>
											{data.data.data.length > 0 ? (
												data.data.data.map((item, index) => (
													<TableTr key={`${item.salesOrderId}-${index}`}>
														<TableTd>
															<TableLink to={`/sales/orders/edit/${item.salesOrderId}`}>
																{item.salesOrderNumber || "-"}
															</TableLink>
														</TableTd>
														<TableTd>{item.customer || "-"}</TableTd>
														<TableTd> {getFormDayPickerDate(item.effectiveDate)}</TableTd>
														<TableTd>{Number(item.quantity)}</TableTd>
													</TableTr>
												))
											) : (
												<TableEmpty colSpan={4} />
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

export default AllocatedDetails;
