import { ChangeEvent, FC, useCallback } from "react";
import { useStore } from "zustand";
import * as Tabs from "@radix-ui/react-tabs";
import { parseAsString, useQueryStates } from "nuqs";

import { ActiveSuppliers } from "./ActiveSuppliers";
import { ArchivedSuppliers } from "./ArchivedSuppliers";

import { useGetActiveSuppliers } from "../api/queries/useGetActiveSuppliers";
import { useGetArchivedSuppliers } from "../api/queries/useGetArchivedSuppliers";

import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { CommonPage, CommonPageHeader, CommonPageTitle, EmptyPage } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useDebounce } from "@/hooks/useDebounce";

const tabsNames = {
	activeSuppliers: "activeSuppliers",
	archivedSuppliers: "archivedSuppliers",
};

const tabsNav = [
	{ content: "Active Suppliers", name: tabsNames.activeSuppliers },
	{ content: "Archived Suppliers", name: tabsNames.archivedSuppliers },
];

const Suppliers: FC = () => {
	const { orgId } = useStore(orgStore);

	const [queryParams, setQueryParams] = useQueryStates({
		q1: parseAsString.withDefault(""),
		q2: parseAsString.withDefault(""),
		p1: parseAsString.withDefault("1"),
		p2: parseAsString.withDefault("1"),
		l1: parseAsString.withDefault("10"),
		l2: parseAsString.withDefault("10"),
		t: parseAsString.withDefault("activeSuppliers"),
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
		data: activeSuppliersData,
		error: activeSuppliersError,
		isError: isActiveSuppliersError,
		isLoading: isActiveSuppliersLoading,
		isSuccess: isActiveSuppliersSuccess,
	} = useGetActiveSuppliers({
		currentTab: queryParams.t === tabsNav[0].name,
		searchValue: activeSearchValue,
		pageNumber: queryParams.p1,
		pageSize: queryParams.l1,
		organisationId: orgId,
		...(queryParams.sort !== "no_sort" && { sort: queryParams.sort as "asc" | "desc" }),
	});

	const {
		data: archivedSuppliersData,
		error: archivedSuppliersError,
		isError: isArchivedSuppliersError,
		isLoading: isArchivedSuppliersLoading,
		isSuccess: isArchivedSuppliersSuccess,
	} = useGetArchivedSuppliers({
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
		isActiveSuppliersSuccess &&
		!activeSuppliersData.data.isSearch &&
		activeSuppliersData.data.suppliers.length < 1
	) {
		return (
			<EmptyPage
				title="Suppliers"
				svgName="suppliers"
				subTilte="Add First Supplier"
				buttonText="Add First Supplier"
				link="/purchases/suppliers/new"
				description="You have no suppliers yet. Create a supplier to get started."
			/>
		);
	}

	return (
		<CommonPage>
			<div className="main__container">
				{isActiveSuppliersLoading && !isArchivedSuppliersSuccess ? (
					<Loader isFullWidth />
				) : !isArchivedSuppliersSuccess && isActiveSuppliersError && activeSuppliersError ? (
					<ErrorMessage error={activeSuppliersError} />
				) : (
					<>
						<CommonPageHeader isSimple>
							<CommonPageTitle>Suppliers</CommonPageTitle>
						</CommonPageHeader>
						<Tabs.Root
							className="tabs"
							value={queryParams.t}
							defaultValue={tabsNav[0].name}
							onValueChange={handleCurrentTab}
						>
							<div className="tabs__header">
								<Tabs.List className="tabs__nav" aria-label="Manage suppliers">
									{tabsNav.map((item) => (
										<Tabs.Trigger key={item.name} className="tabs__btn" value={item.name}>
											{item.content}
										</Tabs.Trigger>
									))}
								</Tabs.List>
							</div>
							<Tabs.Content className="tabs__content" value={tabsNames.activeSuppliers}>
								{isActiveSuppliersLoading && isArchivedSuppliersSuccess ? (
									<Loader isFullWidth />
								) : isArchivedSuppliersSuccess && isActiveSuppliersError && activeSuppliersError ? (
									<ErrorMessage error={activeSuppliersError} />
								) : isActiveSuppliersSuccess && activeSuppliersData.data ? (
									<ActiveSuppliers
										page={queryParams.p1}
										limit={queryParams.l1}
										search={queryParams.q1}
										sort={queryParams.sort}
										data={activeSuppliersData}
										handleSort={handleSort}
										handlePageAndLimit={handleActivePageAndLimit}
										handleChangeSearch={handleActiveChangeSearch}
									/>
								) : (
									<p className="empty_list">No data available</p>
								)}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.archivedSuppliers}>
								{isArchivedSuppliersLoading ? (
									<Loader isFullWidth />
								) : isArchivedSuppliersError && archivedSuppliersError ? (
									<ErrorMessage error={archivedSuppliersError} />
								) : isArchivedSuppliersSuccess && archivedSuppliersData.data ? (
									<ArchivedSuppliers
										page={queryParams.p2}
										limit={queryParams.l2}
										search={queryParams.q2}
										sort={queryParams.sort}
										data={archivedSuppliersData}
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

export default Suppliers;
