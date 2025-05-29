import { ChangeEvent, FC, useCallback, useState } from "react";
import { useStore } from "zustand";
import { useNavigate } from "react-router";
import { parseAsString, useQueryStates } from "nuqs";

import { DeleteDialog } from "./DeleteDialog";

import { AutomationsTypes, AutomationType } from "@/@types/automations";
import { useGetAllAutomations } from "../api/queries/useGetAllAutomations";

import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { Search } from "@/components/widgets/Search";
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
	CommonPageWrapper,
} from "@/components/widgets/Page";

import { useDebounce } from "@/hooks/useDebounce";

import { orgStore } from "@/app/stores/orgStore";

const AutomationsList: FC = () => {
	const { orgId } = useStore(orgStore);
	const navigate = useNavigate();

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
	});

	const [deleteDiaglog, setDeleteDiaglog] = useState(false);
	const [currentItem, setCurrentItem] = useState<AutomationType | null>(null);

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { data, error, isLoading, isError, isSuccess } = useGetAllAutomations({
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

	const handleOnDeleteBtn = (value: AutomationType) => {
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
								<CommonPageTitle>Automations</CommonPageTitle>
								<CommonPageActions>
									<Search
										id="searchId"
										name="search"
										label="Search"
										value={queryParams.q}
										onChange={handleChangeSearch}
									/>
									<Button
										type="button"
										disabled={!orgId}
										onClick={() => navigate("/purchases/automations/new")}
									>
										<svg width="18" height="18" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#plus" />
										</svg>
										Add Automation
									</Button>
								</CommonPageActions>
							</CommonPageHeader>
							<CommonPageMain>
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
													<TableTh>Automation</TableTh>
													<TableTh>Supplier</TableTh>
													<TableTh>Account Number</TableTh>
													<TableTh isCheckbox>Active</TableTh>
													<TableTh isActions>Actions</TableTh>
												</TableTr>
											</TableThead>
											<TableTbody>
												{!data.data.items.length ? (
													<TableEmpty colSpan={5} />
												) : (
													<>
														{data.data.items.map((item) => (
															<TableTr key={item.id}>
																<TableTd>{AutomationsTypes[item.automation]}</TableTd>
																<TableTd>{item.supplier ?? "-"}</TableTd>
																<TableTd>{item.accountNumber}</TableTd>
																<TableTd>
																	<div className="table__td--center">
																		<Checkbox
																			hideLabel
																			label="Default"
																			checked={item.isActive}
																			name={`default-${item.automation}-${item.accountNumber}`}
																			id={`defaultId-${item.automation}-${item.accountNumber}`}
																			readOnly
																		/>
																	</div>
																</TableTd>
																<TableTd>
																	<div className="table__actions">
																		<button
																			type="button"
																			aria-label="Delete automation"
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

export default AutomationsList;
