import { ChangeEvent, FC, useCallback, useEffect } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";
import { parseAsString, useQueryStates } from "nuqs";

import { useGetAllCurrencies } from "../api/quieries/useGetAllCurrencies";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { Search } from "@/components/widgets/Search";
import { Spinner } from "@/components/shared/Spinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	Table,
	TableEmpty,
	TablePagination,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
} from "@/components/widgets/Table";
import {
	CommonPage,
	CommonPageActions,
	CommonPageHeader,
	CommonPageMain,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useSyncXero } from "@/entities/xero";

import { useDebounce } from "@/hooks/useDebounce";

const Currencies: FC = () => {
	const { orgId } = useStore(orgStore);

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
	});

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { isLoadingSync, isSyncSuccess, syncData } = useSyncXero("Currencies", orgId);

	const { data, error, isLoading, isError, isSuccess, refetch } = useGetAllCurrencies({
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

	useEffect(() => {
		if (isSyncSuccess) {
			refetch();
		}
	}, [isSyncSuccess, refetch]);

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageWrapper>
					{isLoading ? (
						<Loader isFullWidth />
					) : isError && error ? (
						<ErrorMessage error={error} />
					) : isSuccess && data.data.currencies ? (
						<>
							<CommonPageHeader>
								<CommonPageTitle>Currency Settings</CommonPageTitle>
								<CommonPageActions>
									<Search
										id="searchId"
										name="search"
										label="Search"
										value={queryParams.q}
										onChange={handleChangeSearch}
									/>
									<Button isSecondary isUseSpinner type="button" onClick={syncData} disabled={isLoadingSync}>
										{isLoadingSync && <Spinner />}
										Sync From Xero
									</Button>
									<Link to="/settings/general-settings" className="link">
										Back to Settings
									</Link>
								</CommonPageActions>
							</CommonPageHeader>
							<CommonPageMain>
								<div className="customTable">
									<div className="customTable__wrapper">
										<Table>
											<TableThead>
												<TableTr>
													<TableTh>Name</TableTh>
													<TableTh>Code</TableTh>
												</TableTr>
											</TableThead>
											<TableTbody>
												{!data.data.currencies.length ? (
													<TableEmpty colSpan={2} />
												) : (
													<>
														{data.data.currencies.map((item) => (
															<TableTr key={item.id}>
																<TableTd>{item.name}</TableTd>
																<TableTd>{item.code}</TableTd>
															</TableTr>
														))}
													</>
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
				</CommonPageWrapper>
			</div>
		</CommonPage>
	);
};

export default Currencies;
