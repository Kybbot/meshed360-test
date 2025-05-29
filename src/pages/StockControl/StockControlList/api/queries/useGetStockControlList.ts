import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { ApiError, ApiResult } from "@/@types/api";
import { GetStockControlResponseType } from "@/@types/stockControl";

export const useGetStockControlList = ({
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
	return useQuery<ApiResult<GetStockControlResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-stock-control-list", organisationId, searchValue, pageNumber, pageSize],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetStockControlResponseType>>(
				`/api/stock-control/${organisationId}?search=${searchValue}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
