import { ChangeEvent, FC, useCallback, useState } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";
import { parseAsString, useQueryStates } from "nuqs";

import { NewDialog } from "./NewDialog";
import { EditDialog } from "./EditDialog";
import { DeleteDialog } from "./DeleteDialog";

import { useGetPriceListCsvData } from "../../hooks/useGetPriceListCsvData";

import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { Search } from "@/components/widgets/Search";
import { Spinner } from "@/components/shared/Spinner";
import { Checkbox } from "@/components/shared/form/Checkbox";
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
	CommonPageButtons,
	CommonPageWrapper,
} from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useGetAllPriceLists } from "@/entities/priceLists";

import { useDebounce } from "@/hooks/useDebounce";

import { PriceListType } from "@/@types/priceLists";

const PriceLists: FC = () => {
	const { orgId } = useStore(orgStore);

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
	});

	const [newDiaglog, setNewDiaglog] = useState(false);
	const [editDiaglog, setEditDiaglog] = useState(false);
	const [deleteDiaglog, setDeleteDiaglog] = useState(false);
	const [currentTableItemId, setCurrentTableItemId] = useState<string>();
	const [currentItem, setCurrentItem] = useState<PriceListType | null>(null);

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { data, error, isLoading, isError, isSuccess } = useGetAllPriceLists({
		organisationId: orgId,
		pageNumber: queryParams.p,
		pageSize: queryParams.l,
		searchValue,
	});

	const { isLoadingCsvData, getCsvData } = useGetPriceListCsvData(
		orgId,
		currentTableItemId,
		data?.data?.priceLists.find((pl) => pl.id === currentTableItemId)?.name,
	);

	const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setQueryParams((prev) => ({ ...prev, q: event.target.value }));
	};

	const handlePageAndLimit = (p: string, l: string) => {
		setQueryParams((prev) => ({ ...prev, p: p, l: l }));
	};

	const handleOnEdit = (value: PriceListType) => {
		setCurrentItem(value);
		setEditDiaglog(true);
	};

	const handleOnDeleteBtn = (value: PriceListType) => {
		setCurrentItem(value);
		setDeleteDiaglog(true);
	};

	const handleClearCurrentItem = useCallback(() => {
		setCurrentItem(null);
	}, []);

	const handleCurrentTableItemId = (value: string) => {
		setCurrentTableItemId((prev) => {
			if (prev === value) return undefined;
			return value;
		});
	};

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
								<CommonPageTitle>Price List Names</CommonPageTitle>
								<CommonPageActions>
									<Search
										id="searchId"
										name="search"
										label="Search"
										value={queryParams.q}
										onChange={handleChangeSearch}
									/>
									<Link
										className="link link--secondary"
										to="/settings/general-settings/pricelist-names/import"
									>
										<svg width="18" height="18" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#import" />
										</svg>
										Import
									</Link>
									<NewDialog orgId={orgId} dialogState={newDiaglog} setDialogState={setNewDiaglog} />
									<Link to="/settings/general-settings" className="link">
										Back to Settings
									</Link>
								</CommonPageActions>
							</CommonPageHeader>
							{currentTableItemId && (
								<CommonPageButtons>
									<Button
										isSecondary
										type="button"
										onClick={getCsvData}
										disabled={isLoadingCsvData}
										isUseSpinner={isLoadingCsvData}
									>
										{isLoadingCsvData ? (
											<Spinner />
										) : (
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#export" />
											</svg>
										)}
										Export
									</Button>
								</CommonPageButtons>
							)}
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
													<TableTh isCurrentItem>
														<span className="srOnly">Current Item</span>
													</TableTh>
													<TableTh>Name</TableTh>
													<TableTh>Currency</TableTh>
													<TableTh isActions>Actions</TableTh>
												</TableTr>
											</TableThead>
											<TableTbody>
												{!data.data.priceLists.length ? (
													<TableEmpty colSpan={3} />
												) : (
													<>
														{data.data.priceLists.map((item) => (
															<TableTr key={item.id}>
																<TableTd>
																	<Checkbox
																		hideLabel
																		label="Current Item"
																		onChange={() => {
																			handleCurrentTableItemId(item.id);
																		}}
																		checked={item.id === currentTableItemId}
																	/>
																</TableTd>
																<TableTd>{item.name}</TableTd>
																<TableTd>{item.currencyDescription}</TableTd>
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
						</>
					) : (
						<p className="empty_list">No data available</p>
					)}
				</CommonPageWrapper>
			</div>
		</CommonPage>
	);
};
export default PriceLists;
