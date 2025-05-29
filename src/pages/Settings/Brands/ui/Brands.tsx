import { ChangeEvent, FC, useCallback, useState } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";
import { parseAsString, useQueryStates } from "nuqs";

import { NewDialog } from "./NewDialog";
import { EditDialog } from "./EditDialog";
import { DeleteDialog } from "./DeleteDialog";

import { useGetAllBrands } from "../api/queries/useGetAllBrands";

import { Loader } from "@/components/shared/Loader";
import { Search } from "@/components/widgets/Search";
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

import { useDebounce } from "@/hooks/useDebounce";

import { UnitOfMeasureType } from "@/@types/unitsOfMeasure";

const Brands: FC = () => {
	const { orgId } = useStore(orgStore);

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
	});

	const [newDialog, setNewDialog] = useState(false);
	const [editDialog, setEditDialog] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState(false);
	const [currentItem, setCurrentItem] = useState<UnitOfMeasureType | null>(null);

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { data, error, isLoading, isError, isSuccess } = useGetAllBrands({
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

	const handleOnEdit = (value: UnitOfMeasureType) => {
		setCurrentItem(value);
		setEditDialog(true);
	};

	const handleOnDeleteBtn = (value: UnitOfMeasureType) => {
		setCurrentItem(value);
		setDeleteDialog(true);
	};

	const handleClearCurrentItem = useCallback(() => {
		setCurrentItem(null);
	}, []);

	return (
		<CommonPage>
			<div className="main__container">
				{isLoading ? (
					<Loader isFullWidth />
				) : isError && error ? (
					<ErrorMessage error={error} />
				) : isSuccess && data.data ? (
					<CommonPageWrapper>
						<CommonPageHeader>
							<CommonPageTitle>Brands</CommonPageTitle>
							<CommonPageActions>
								<Search
									id="searchId"
									name="search"
									label="Search"
									value={queryParams.q}
									onChange={handleChangeSearch}
								/>
								<NewDialog orgId={orgId} dialogState={newDialog} setDialogState={setNewDialog} />
								<Link to="/settings/general-settings" className="link">
									Back to Settings
								</Link>
							</CommonPageActions>
						</CommonPageHeader>
						<CommonPageMain>
							{editDialog && currentItem && (
								<EditDialog
									orgId={orgId}
									dialogState={editDialog}
									currentItem={currentItem}
									setDialogState={setEditDialog}
									handleClearCurrentItem={handleClearCurrentItem}
								/>
							)}
							{deleteDialog && currentItem && (
								<DeleteDialog
									orgId={orgId}
									currentItem={currentItem}
									dialogState={deleteDialog}
									setDialogState={setDeleteDialog}
									handleClearCurrentItem={handleClearCurrentItem}
								/>
							)}
							<div className="customTable">
								<div className="customTable__wrapper">
									<Table>
										<TableThead>
											<TableTr>
												<TableTh>Brand</TableTh>
												<TableTh isActions>Actions</TableTh>
											</TableTr>
										</TableThead>
										<TableTbody>
											{!data.data.brands.length ? (
												<TableEmpty colSpan={2} />
											) : (
												<>
													{data.data.brands.map((item) => (
														<TableTr key={item.id}>
															<TableTd>{item.name}</TableTd>
															<TableTd>
																<div className="table__actions">
																	<button
																		type="button"
																		aria-label="Edit user"
																		className="table__action table__action--edit"
																		onClick={() => {
																			handleOnEdit(item);
																		}}
																	>
																		<svg width="20" height="20" focusable="false" aria-hidden="true">
																			<use xlinkHref="/icons/icons.svg#edit" />
																		</svg>
																	</button>
																	<button
																		type="button"
																		aria-label="Delete user"
																		className="table__action table__action--delete"
																		onClick={() => {
																			handleOnDeleteBtn(item);
																		}}
																	>
																		<svg width="20" height="20" focusable="false" aria-hidden="true">
																			<use xlinkHref="/icons/icons.svg#delete" />
																		</svg>
																	</button>
																</div>
															</TableTd>
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
					</CommonPageWrapper>
				) : (
					<p className="empty_list">No data available</p>
				)}
			</div>
		</CommonPage>
	);
};

export default Brands;
