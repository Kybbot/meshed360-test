import { ChangeEvent, FC, useCallback } from "react";
import { useStore } from "zustand";
import * as Tabs from "@radix-ui/react-tabs";
import { parseAsString, useQueryStates } from "nuqs";

import { ActiveProducts } from "./ActiveProducts";
import { ArchivedProducts } from "./ArchivedProducts";

import { useGetActiveProducts } from "../api/queries/useGetActiveProducts";
import { useGetArchivedProducts } from "../api/queries/useGetArchivedProducts";

import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { CommonPage, CommonPageHeader, CommonPageTitle, EmptyPage } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useDebounce } from "@/hooks/useDebounce";

const tabsNames = {
	activeProducts: "activeProducts",
	archivedProducts: "archivedProducts",
};

const tabsNav = [
	{ content: "Active Products", name: tabsNames.activeProducts },
	{ content: "Archived Products", name: tabsNames.archivedProducts },
];

const Customers: FC = () => {
	const { orgId } = useStore(orgStore);

	const [queryParams, setQueryParams] = useQueryStates({
		q1: parseAsString.withDefault(""),
		q2: parseAsString.withDefault(""),
		p1: parseAsString.withDefault("1"),
		p2: parseAsString.withDefault("1"),
		l1: parseAsString.withDefault("10"),
		l2: parseAsString.withDefault("10"),
		t: parseAsString.withDefault("activeProducts"),
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
		data: activeProductsData,
		error: activeProductsError,
		isError: isActiveProductsError,
		isLoading: isActiveProductsLoading,
		isSuccess: isActiveProductsSuccess,
	} = useGetActiveProducts({
		currentTab: queryParams.t === tabsNav[0].name,
		searchValue: activeSearchValue,
		pageNumber: queryParams.p1,
		pageSize: queryParams.l1,
		organisationId: orgId,
	});

	const {
		data: archivedProductsData,
		error: archivedProductsError,
		isError: isArchivedProductsError,
		isLoading: isArchivedProductsLoading,
		isSuccess: isArchivedProductsSuccess,
	} = useGetArchivedProducts({
		currentTab: queryParams.t === tabsNav[1].name,
		searchValue: archivedSearchValue,
		pageNumber: queryParams.p2,
		pageSize: queryParams.l2,
		organisationId: orgId,
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

	if (
		isActiveProductsSuccess &&
		!activeProductsData.data.isSearch &&
		activeProductsData.data.allProducts.length < 1
	) {
		return (
			<EmptyPage
				title="Products"
				svgName="products"
				subTilte="Add First Product"
				buttonText="Add First Product"
				link="/inventory/products/new"
				description="You have no products yet. Create a product to get started."
			/>
		);
	}

	return (
		<CommonPage>
			<div className="main__container">
				{isActiveProductsLoading && !isArchivedProductsSuccess ? (
					<Loader isFullWidth />
				) : !isArchivedProductsSuccess && isActiveProductsError && activeProductsError ? (
					<ErrorMessage error={activeProductsError} />
				) : (
					<>
						<CommonPageHeader isSimple>
							<CommonPageTitle>Products</CommonPageTitle>
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
							<Tabs.Content className="tabs__content" value={tabsNames.activeProducts}>
								{isActiveProductsLoading && isArchivedProductsSuccess ? (
									<Loader isFullWidth />
								) : isArchivedProductsSuccess && isActiveProductsError && activeProductsError ? (
									<ErrorMessage error={activeProductsError} />
								) : isActiveProductsSuccess && activeProductsData.data ? (
									<ActiveProducts
										page={queryParams.p1}
										limit={queryParams.l1}
										search={queryParams.q1}
										data={activeProductsData}
										handlePageAndLimit={handleActivePageAndLimit}
										handleChangeSearch={handleActiveChangeSearch}
									/>
								) : (
									<p className="empty_list">No data available</p>
								)}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.archivedProducts}>
								{isArchivedProductsLoading ? (
									<Loader isFullWidth />
								) : isArchivedProductsError && archivedProductsError ? (
									<ErrorMessage error={archivedProductsError} />
								) : isArchivedProductsSuccess && archivedProductsData.data ? (
									<ArchivedProducts
										page={queryParams.p2}
										limit={queryParams.l2}
										search={queryParams.q2}
										data={archivedProductsData}
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
