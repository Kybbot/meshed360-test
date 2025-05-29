import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { ReportsTable } from "@/@types/reports";
import defaultDatesFromTo from "../helpers/defaultDatesFromTo";

export const useGetReportsTable = ({
	apiUrl,
	queryKey,
	organisationId,
	from,
	to,
	searchValue,
	pageSize,
	pageNumber,
}: {
	apiUrl: string;
	queryKey?: string;
	organisationId?: string;
	searchValue: string;
	pageSize: string;
	pageNumber: string;
	from?: string;
	to?: string;
}) => {
	const { dateFrom, dateTo } = defaultDatesFromTo(from, to);

	return useQuery<ApiResult<ReportsTable>, AxiosError<ApiError>>({
		queryKey: [queryKey, apiUrl, organisationId, dateFrom, dateTo, { searchValue, pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<ReportsTable>>(
				`${apiUrl}${organisationId}?search=${searchValue}&pageSize=${pageSize}&pageNumber=${pageNumber}&from=${dateFrom}&to=${dateTo}`,
			);

			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
