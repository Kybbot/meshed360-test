import { ChangeEvent, FC, useCallback, useState } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";
import { parseAsString, useQueryStates } from "nuqs";

import { NewDialog } from "./NewDialog";
import { EditDialog } from "./EditDialog";
import { DeleteDialog } from "./DeleteDialog";

import { useGetAllWarehouses } from "../api/queries/useGetAllWarehouses";

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

import { WarehousType } from "@/@types/warehouses";

const Warehouses: FC = () => {
	const { orgId } = useStore(orgStore);

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
	});
	const [newDiaglog, setNewDiaglog] = useState(false);
	const [editDiaglog, setEditDiaglog] = useState(false);
	const [deleteDiaglog, setDeleteDiaglog] = useState(false);
	const [currentItem, setCurrentItem] = useState<WarehousType | null>(null);

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { data, error, isLoading, isError, isSuccess } = useGetAllWarehouses({
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

	const handleOnEdit = (value: WarehousType) => {
		setCurrentItem(value);
		setEditDiaglog(true);
	};

	const handleOnDeleteBtn = (value: WarehousType) => {
		setCurrentItem(value);
		setDeleteDiaglog(true);
	};

	const handleClearCurrentItem = useCallback(() => {
		setCurrentItem(null);
	}, []);

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageWrapper>
					{isLoading ? (
						<Loader isFullWidth />
					) : isError && error ? (
						<ErrorMessage error={error} />
					) : isSuccess && data.data ? (
						<>
							<CommonPageHeader>
								<CommonPageTitle>Warehouse Settings</CommonPageTitle>
								<CommonPageActions>
									<Search
										id="searchId"
										name="search"
										label="Search"
										value={queryParams.q}
										onChange={handleChangeSearch}
									/>
									<NewDialog orgId={orgId} dialogState={newDiaglog} setDialogState={setNewDiaglog} />
									<Link to="/settings/general-settings" className="link">
										Back to Settings
									</Link>
								</CommonPageActions>
							</CommonPageHeader>
							<CommonPageMain>
								{editDiaglog && currentItem && (
									<EditDialog
										orgId={orgId}
										dialogState={editDiaglog}
										currentItem={currentItem}
										setDialogState={setEditDiaglog}
										handleClearCurrentItem={handleClearCurrentItem}
									/>
								)}
								{deleteDiaglog && currentItem && (
									<DeleteDialog
										dialogState={deleteDiaglog}
										currentItem={currentItem}
										setDialogState={setDeleteDiaglog}
										handleClearCurrentItem={handleClearCurrentItem}
									/>
								)}

								<div className="customTable">
									<div className="customTable__wrapper">
										<Table>
											<TableThead>
												<TableTr>
													<TableTh>Name</TableTh>
													<TableTh>Comments</TableTh>
													<TableTh isActions>Actions</TableTh>
												</TableTr>
											</TableThead>
											<TableTbody>
												{data.data.warehouses.length > 0 ? (
													<>
														{data.data.warehouses.map((item) => (
															<TableTr key={item.id}>
																<TableTd>{item.name}</TableTd>
																<TableTd>{item.comments || "-"}</TableTd>
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
												) : (
													<TableEmpty colSpan={3} />
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

export default Warehouses;
