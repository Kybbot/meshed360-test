import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllSalesRepsResponseType } from "@/@types/salesReps";

export const useGetAllSalesReps = ({
	organisationId,
	searchValue,
	pageNumber,
	pageSize,
}: {
	organisationId?: string;
	searchValue: string;
	pageNumber: string;
	pageSize: string;
}) => {
	return useQuery<ApiResult<GetAllSalesRepsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-all-salesReps", organisationId, { searchValue, pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllSalesRepsResponseType>>(
				`/api/organisation/sales-rep/${organisationId}?search=${searchValue}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
