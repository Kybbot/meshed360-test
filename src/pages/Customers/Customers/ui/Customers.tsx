import { ChangeEvent, FC, useCallback } from "react";
import { useStore } from "zustand";
import * as Tabs from "@radix-ui/react-tabs";
import { parseAsString, useQueryStates } from "nuqs";

import { ActiveCustomers } from "./ActiveCustomers";
import { ArchivedCustomers } from "./ArchivedCustomers";

import { useGetActiveCustomers } from "../api/queries/useGetActiveCustomers";
import { useGetArchivedCustomers } from "../api/queries/useGetArchivedCustomers";

import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { CommonPage, CommonPageHeader, CommonPageTitle, EmptyPage } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useDebounce } from "@/hooks/useDebounce";

const tabsNames = {
	activeCustomers: "activeCustomers",
	archivedCustomers: "archivedCustomers",
};

const tabsNav = [
	{ content: "Active Customers", name: tabsNames.activeCustomers },
	{ content: "Archived Customers", name: tabsNames.archivedCustomers },
];

const Customers: FC = () => {
	const orgId = useStore(orgStore, (selector) => selector.orgId);

	const [queryParams, setQueryParams] = useQueryStates({
		q1: parseAsString.withDefault(""),
		q2: parseAsString.withDefault(""),
		p1: parseAsString.withDefault("1"),
		p2: parseAsString.withDefault("1"),
		l1: parseAsString.withDefault("10"),
		l2: parseAsString.withDefault("10"),
		t: parseAsString.withDefault("activeCustomers"),
		sort: parseAsString.withDefault("no_sort"),
	});

	const resetActivePage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p1: "1" }));
	}, [setQueryParams]);

	const resetArchivePage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p2: "1" }));
	}, [setQueryParams]);

	const activeSearchValue = useDebounce<string>(queryParams.q1, 700, resetActivePage);
	const archivedSearchValue = useDebounce<string>(queryParams.q2, 700, resetArchivePage);

	const {
		data: activeCustomersData,
		error: activeCustomersError,
		isError: isActiveCustomersError,
		isLoading: isActiveCustomersLoading,
		isSuccess: isActiveCustomersSuccess,
	} = useGetActiveCustomers({
		currentTab: queryParams.t === tabsNav[0].name,
		searchValue: activeSearchValue,
		pageNumber: queryParams.p1,
		pageSize: queryParams.l1,
		organisationId: orgId,
		...(queryParams.sort !== "no_sort" && { sort: queryParams.sort as "asc" | "desc" }),
	});

	const {
		data: archivedCustomersData,
		error: archivedCustomersError,
		isError: isArchivedCustomersError,
		isLoading: isArchivedCustomersLoading,
		isSuccess: isArchivedCustomersSuccess,
	} = useGetArchivedCustomers({
		currentTab: queryParams.t === tabsNav[1].name,
		searchValue: archivedSearchValue,
		pageNumber: queryParams.p2,
		pageSize: queryParams.l2,
		organisationId: orgId,
		...(queryParams.sort !== "no_sort" && { sort: queryParams.sort as "asc" | "desc" }),
	});

	const handleCurrentTab = (value: string) => {
		setQueryParams((prev) => ({ ...prev, t: value }));
	};

	const handleActivePageAndLimit = (p: string, l: string) => {
		setQueryParams((prev) => ({ ...prev, p1: p, l1: l }));
	};

	const handleArchivePageAndLimit = (p: string, l: string) => {
		setQueryParams((prev) => ({ ...prev, p2: p, l2: l }));
	};

	const handleActiveChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setQueryParams((prev) => ({ ...prev, q1: event.target.value }));
	};

	const handleArchivedChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setQueryParams((prev) => ({ ...prev, q2: event.target.value }));
	};

	const handleSort = () => {
		const current = queryParams.sort;
		const next = current === "no_sort" ? "asc" : current === "asc" ? "desc" : "no_sort";

		setQueryParams((prev) => ({
			...prev,
			sort: next,
			p1: "1",
			p2: "1",
		}));
	};

	if (
		isActiveCustomersSuccess &&
		!activeCustomersData.data.isSearch &&
		activeCustomersData.data.customers.length < 1
	) {
		return (
			<EmptyPage
				svgName="users"
				title="Customers"
				buttonText="Add Customer"
				link="/sales/customers/new"
				subTilte="Add First Customer"
				description="You have no customers yet. Create a customer to get started."
			/>
		);
	}

	return (
		<CommonPage>
			<div className="main__container">
				{isActiveCustomersLoading && !isArchivedCustomersSuccess ? (
					<Loader isFullWidth />
				) : !isArchivedCustomersSuccess && isActiveCustomersError && activeCustomersError ? (
					<ErrorMessage error={activeCustomersError} />
				) : (
					<>
						<CommonPageHeader isSimple>
							<CommonPageTitle>Customers</CommonPageTitle>
						</CommonPageHeader>
						<Tabs.Root
							className="tabs"
							value={queryParams.t}
							defaultValue={tabsNav[0].name}
							onValueChange={handleCurrentTab}
						>
							<div className="tabs__header">
								<Tabs.List className="tabs__nav" aria-label="Manage users & roles">
									{tabsNav.map((item) => (
										<Tabs.Trigger key={item.name} className="tabs__btn" value={item.name}>
											{item.content}
										</Tabs.Trigger>
									))}
								</Tabs.List>
							</div>
							<Tabs.Content className="tabs__content" value={tabsNames.activeCustomers}>
								{isActiveCustomersLoading && isArchivedCustomersSuccess ? (
									<Loader isFullWidth />
								) : isArchivedCustomersSuccess && isActiveCustomersError && activeCustomersError ? (
									<ErrorMessage error={activeCustomersError} />
								) : isActiveCustomersSuccess && activeCustomersData.data ? (
									<ActiveCustomers
										page={queryParams.p1}
										limit={queryParams.l1}
										search={queryParams.q1}
										sort={queryParams.sort}
										data={activeCustomersData}
										handleSort={handleSort}
										handlePageAndLimit={handleActivePageAndLimit}
										handleChangeSearch={handleActiveChangeSearch}
									/>
								) : (
									<p className="empty_list">No data available</p>
								)}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.archivedCustomers}>
								{isArchivedCustomersLoading ? (
									<Loader isFullWidth />
								) : isArchivedCustomersError && archivedCustomersError ? (
									<ErrorMessage error={archivedCustomersError} />
								) : isArchivedCustomersSuccess && archivedCustomersData.data ? (
									<ArchivedCustomers
										page={queryParams.p2}
										limit={queryParams.l2}
										search={queryParams.q2}
										sort={queryParams.sort}
										data={archivedCustomersData}
										handleSort={handleSort}
										handlePageAndLimit={handleArchivePageAndLimit}
										handleChangeSearch={handleArchivedChangeSearch}
									/>
								) : (
									<p className="empty_list">No data available</p>
								)}
							</Tabs.Content>
						</Tabs.Root>
					</>
				)}
			</div>
		</CommonPage>
	);
};

export default Customers;
