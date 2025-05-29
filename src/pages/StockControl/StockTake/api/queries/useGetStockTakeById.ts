import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { ApiError, ApiResult } from "@/@types/api";
import { GetStockTakeResponseType } from "@/@types/stockControl";

export const useGetStockTakeById = ({
	organisationId,
	stockTakeId,
}: {
	organisationId?: string;
	stockTakeId?: string;
}) => {
	return useQuery<ApiResult<GetStockTakeResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-stock-take-by-id", organisationId, stockTakeId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetStockTakeResponseType>>(
				`/api/stock-control/${organisationId}/stock-takes/${stockTakeId}`,
			);
			return data;
		},
		enabled: !!organisationId && !!stockTakeId,
	});
};
