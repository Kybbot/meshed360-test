/* eslint-disable react-hooks/exhaustive-deps */
import { orgStore } from "@/app/stores/orgStore";
import { useStore } from "zustand";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import {
	CommonPage,
	CommonPageActions,
	CommonPageHeader,
	CommonPageMain,
	CommonPageTitle,
} from "@/components/widgets/Page";
import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Search } from "@/components/widgets/Search";
import { LayoutOptions } from "@/components/widgets/LayoutOptions";
import {
	Table,
	TableEmpty,
	TablePagination,
	TableTbody,
	TableThead,
	TableTr,
} from "@/components/widgets/Table";
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from "react";
import { useQueryStates, parseAsString } from "nuqs";
import { useDebounce } from "@/hooks/useDebounce";
import { ReportsLayoutOptionsTypes, useReportsTable } from "../../hooks/useReportsTable";
import { useGetReportsTable } from "../../api/useGetReportsTable";
import reportsApis from "../../api/reportsApis";
import { getFormDayPickerDate } from "@/utils/date";

import { Button } from "@/components/shared/Button";
import { useGetExportData } from "@/hooks/useGetCsvData";
import { Spinner } from "@/components/shared/Spinner";
import { useNavigate } from "react-router";
import { SpecificationDialog } from "../SpecificationDialog/SpecificationDialog";
import { CustomDayPicker } from "@/components/shared/CustomDayPicker";
import defaultDatesFromTo, { formatToIsoDateString } from "../../helpers/defaultDatesFromTo";

interface IReportTamplate {
	reportApiKey: keyof typeof reportsApis;
	layoutOptionsName: ReportsLayoutOptionsTypes;
	title: string;
}

const DEFAULT_CSV_API_URL = "";

const ReportTamplate: FC<IReportTamplate> = ({ reportApiKey, layoutOptionsName, title }) => {
	const { orgId } = useStore(orgStore);
	const navigate = useNavigate();

	const defaultDateFrom = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

	const [isDialog, setIsDialog] = useState(false);
	const [from, setFrom] = useState<Date | undefined>(defaultDateFrom);
	const [to, setTo] = useState<Date | undefined>(new Date());

	const [csvApiUrl, setCsvApiUrl] = useState<string>(DEFAULT_CSV_API_URL);

	const fileNameRef = useRef("");

	const [queryParams, setQueryParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		p: parseAsString.withDefault("1"),
		l: parseAsString.withDefault("10"),
		from: parseAsString.withDefault(""),
		to: parseAsString.withDefault(""),
	});

	const resetPage = useCallback(() => {
		setQueryParams((prev) => ({ ...prev, p: "1" }));
	}, [setQueryParams]);

	const searchValue = useDebounce<string>(queryParams.q, 700, resetPage);

	const { data, error, isLoading, isError, isSuccess, refetch } = useGetReportsTable({
		apiUrl: reportsApis[reportApiKey].apiUrl,
		queryKey: reportsApis[reportApiKey].qweryKey,
		organisationId: orgId,
		pageNumber: queryParams.p,
		pageSize: queryParams.l,
		searchValue,
		from: queryParams.from,
		to: queryParams.to,
	});

	const { columns, layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useReportsTable(
		data?.data.table.headers || [],
		layoutOptionsName,
	);

	const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setQueryParams((prev) => ({ ...prev, q: event.target.value }));
	};

	const handlePageAndLimit = (p: string, l: string) => {
		setQueryParams((prev) => ({ ...prev, p: p, l: l }));
	};

	const [format, setFormat] = useState<"csv" | "xlsx">("csv");
	const { isLoadingExportData, getExportData } = useGetExportData("Report", orgId, csvApiUrl, format);

	const handleDownloadReportData = (format: "csv" | "xlsx") => {
		setFormat(format);

		const isoDateFrom = formatToIsoDateString(from ?? new Date());
		const isoDateTo = formatToIsoDateString(to ?? new Date());

		fileNameRef.current = `${title.replace(/\s+/g, "_")}_Report_${getFormDayPickerDate(new Date())}`;

		const columnLabels = Object.values(layoutOptions)
			.filter((col) => col.isShown)
			.map((col) => encodeURIComponent(col.name))
			.join(",");

		let url = `${reportsApis[reportApiKey].apiUrl}${orgId}/${format}?from=${isoDateFrom}&to=${isoDateTo}`;
		if (searchValue) url += `&search=${encodeURIComponent(searchValue)}`;
		if (columnLabels) url += `&columns=${columnLabels}`;

		setCsvApiUrl(url);
	};

	const onFromChange = (e?: Date | undefined | null) => {
		if (e) {
			const dateFrom = formatToIsoDateString(e as Date);

			setFrom(e);
			setQueryParams((prev) => ({
				...prev,
				from: dateFrom,
			}));
		} else {
			setFrom(undefined);
			setQueryParams((prev) => ({
				...prev,
				from: "",
			}));
		}
	};

	const onToChange = (e?: Date | null) => {
		if (e) {
			const dateTo = formatToIsoDateString(e);

			setTo(e);
			setQueryParams((prev) => ({
				...prev,
				to: dateTo,
			}));
		} else {
			setTo(undefined);
			setQueryParams((prev) => ({
				...prev,
				to: "",
			}));
		}
	};

	const handleUpdate = () => {
		refetch();
	};

	useEffect(() => {
		const { dateFrom, dateTo } = defaultDatesFromTo();

		setQueryParams((prev) => ({
			...prev,
			from: dateFrom,
			to: dateTo,
		}));
	}, []);

	useEffect(() => {
		if (!csvApiUrl) return;

		getExportData(fileNameRef.current);
		setCsvApiUrl(DEFAULT_CSV_API_URL);
	}, [csvApiUrl]);

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
							<CommonPageTitle>{title}</CommonPageTitle>
							<CommonPageActions>
								<DropdownMenuRoot modal={false}>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											isSecondary
											disabled={isLoadingExportData}
											isUseSpinner={isLoadingExportData}
										>
											{isLoadingExportData ? (
												<Spinner />
											) : (
												<svg width="18" height="18" focusable="false" aria-hidden="true">
													<use xlinkHref="/icons/icons.svg#export" />
												</svg>
											)}
											Export
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
										<DropdownMenuItem
											className="dropDown__item"
											onClick={() => handleDownloadReportData("csv")}
										>
											Export as CSV
										</DropdownMenuItem>
										<DropdownMenuItem
											className="dropDown__item"
											onClick={() => handleDownloadReportData("xlsx")}
										>
											Export as XLSX
										</DropdownMenuItem>
									</DropdownMenu>
								</DropdownMenuRoot>
								<Button type="button" isSecondary onClick={() => setIsDialog(true)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10H10L10.0055 9.85074C10.0818 8.81588 10.9456 8 12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C11.4477 12 11 12.4477 11 13V14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14V13.874C14.7252 13.4299 16 11.8638 16 10ZM13 18V16H11V18H13Z"
											fill="#1e5eff"
										/>
									</svg>
									Fields Specification
								</Button>
								<SpecificationDialog dialogState={isDialog} setDialogState={setIsDialog} />
								<Button type="button" isSecondary onClick={() => navigate(-1)}>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#list" />
									</svg>
									Back to Reports
								</Button>
							</CommonPageActions>
						</CommonPageHeader>
						<CommonPageHeader>
							<div style={{ flex: "1", display: "flex", width: "100%", gap: "20px", maxWidth: "520px" }}>
								<CustomDayPicker
									label="From"
									date={from}
									error={""}
									setDate={onFromChange}
									btnWrapperClassName=""
								/>
								<CustomDayPicker
									label="To"
									date={to}
									error={""}
									setDate={onToChange}
									btnWrapperClassName=""
								/>
							</div>
							<CommonPageActions>
								<Search
									id="searchId"
									name="search"
									label="Search"
									value={queryParams.q}
									onChange={handleChangeSearch}
								/>

								<LayoutOptions
									data={layoutOptions}
									handleReset={handleResetLayoutOptions}
									handleToggle={handleToggleLayoutOptions}
								/>

								<Button onClick={handleUpdate} isLoading={isLoading}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C10.9698 5 9.96528 5.19531 9.02818 5.57046L8 3L5 9L11 10.5L9.77096 7.42741C10.4729 7.14633 11.2254 7 12 7C15.3137 7 18 9.68629 18 13C18 16.3137 15.3137 19 12 19C8.68629 19 6 16.3137 6 13C6 12.4477 5.55228 12 5 12C4.44771 12 4 12.4477 4 13C4 17.4183 7.58172 21 12 21Z"
											fill="#ffffff"
										/>
									</svg>{" "}
									Update
								</Button>
							</CommonPageActions>
						</CommonPageHeader>
						<CommonPageMain>
							<div className="customTable">
								<div className="customTable__wrapper">
									<Table>
										<TableThead>
											<TableTr>
												{columns?.map((column, index) => {
													return column.renderHeader(column, index);
												})}
											</TableTr>
										</TableThead>
										<TableTbody>
											{data.data.table.rows.length > 0 ? (
												<>
													{data.data.table.rows.map((row, i) => (
														<TableTr key={row + i.toString()} isTotal={row.isTotal}>
															{columns?.map((column) => {
																return column.renderItem(row.columns, column);
															})}
														</TableTr>
													))}
												</>
											) : (
												<TableEmpty colSpan={columns.length} />
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

export default ReportTamplate;
