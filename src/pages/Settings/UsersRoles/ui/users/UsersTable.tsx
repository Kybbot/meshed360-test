import { ChangeEvent, FC, useCallback, useState } from "react";
import { useStore } from "zustand";
import { parseAsString, useQueryStates } from "nuqs";

import { NewDialog } from "./NewDialog";
import { EditDialog } from "./EditDialog";
import { DeleteDialog } from "./DeleteDialog";

import { useGetAllUsers } from "../../api/queries/useGetAllUsers";

import { Loader } from "@/components/shared/Loader";
import { Search } from "@/components/widgets/Search";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	Table,
	TableEmpty,
	TablePagination,
	TableStatus,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
} from "@/components/widgets/Table";
import { CommonPageActions, CommonPageMain, CommonPageWrapper } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useDebounce } from "@/hooks/useDebounce";

import { UserType } from "@/@types/users";

export const UsersTable: FC = () => {
	const { orgId } = useStore(orgStore);

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
	});

	const [newDiaglog, setNewDiaglog] = useState(false);
	const [deleteDiaglog, setDeleteDiaglog] = useState(false);
	const [editUserDiaglog, setEditUserDiaglog] = useState(false);
	const [currentItem, setCurrentItem] = useState<UserType | null>(null);

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { data, error, isLoading, isError, isSuccess } = useGetAllUsers({
		searchValue,
		pageNumber: queryParams.p,
		pageSize: queryParams.l,
		organisationId: orgId,
	});

	const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setQueryParams((prev) => ({ ...prev, q: event.target.value }));
	};

	const handlePageAndLimit = (p: string, l: string) => {
		setQueryParams((prev) => ({ ...prev, p: p, l: l }));
	};

	const handleOnEditUser = (value: UserType) => {
		setCurrentItem(value);
		setEditUserDiaglog(true);
	};

	const handleOnDeleteUser = (value: UserType) => {
		setCurrentItem(value);
		setDeleteDiaglog(true);
	};

	const handleClearCurrentItem = useCallback(() => {
		setCurrentItem(null);
	}, []);

	return (
		<CommonPageWrapper>
			{isLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isSuccess && data.data ? (
				<>
					<CommonPageActions isComplex>
						<Search
							id="searchId"
							name="search"
							label="Search"
							value={queryParams.q}
							onChange={handleChangeSearch}
						/>
						<NewDialog orgId={orgId} dialogState={newDiaglog} setDialogState={setNewDiaglog} />
					</CommonPageActions>
					<CommonPageMain>
						{editUserDiaglog && currentItem && (
							<EditDialog
								orgId={orgId}
								currentItem={currentItem}
								dialogState={editUserDiaglog}
								setDialogState={setEditUserDiaglog}
								handleClearCurrentItem={handleClearCurrentItem}
							/>
						)}
						{deleteDiaglog && currentItem && (
							<DeleteDialog
								currentItem={currentItem}
								dialogState={deleteDiaglog}
								setDialogState={setDeleteDiaglog}
								handleClearCurrentItem={handleClearCurrentItem}
							/>
						)}

						<div className="customTable">
							<div className="customTable__wrapper">
								<Table>
									<TableThead>
										<TableTr>
											<TableTh>Full Name</TableTh>
											<TableTh>Email Address</TableTh>
											<TableTh isCheckbox>Is Active</TableTh>
											<TableTh isActions>Actions</TableTh>
										</TableTr>
									</TableThead>
									<TableTbody>
										{!data.data.users.length ? (
											<TableEmpty colSpan={4} />
										) : (
											<>
												{data.data.users.map((user) => (
													<TableTr key={user.user.id}>
														<TableTd>{user.user.name}</TableTd>
														<TableTd>{user.user.email}</TableTd>
														<TableTd isCapitalize>
															<TableStatus isGreen={user.user.status === "active"}>
																{user.user.status}
															</TableStatus>
														</TableTd>
														<TableTd>
															<div className="table__actions">
																<button
																	type="button"
																	aria-label="Edit user"
																	className="table__action table__action--edit"
																	onClick={() => {
																		handleOnEditUser(user);
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
																		handleOnDeleteUser(user);
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
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
