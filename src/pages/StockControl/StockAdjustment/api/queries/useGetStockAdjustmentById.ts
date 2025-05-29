import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetStockAdjustmentResponseType } from "@/@types/stockControl";

export const useGetStockAdjustmentById = ({
	organisationId,
	stockAdjustmentId,
}: {
	organisationId?: string;
	stockAdjustmentId?: string;
}) => {
	return useQuery<ApiResult<GetStockAdjustmentResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-stock-adjustment-by-id", organisationId, stockAdjustmentId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetStockAdjustmentResponseType>>(
				`/api/stock-control/${organisationId}/adjustments/${stockAdjustmentId}`,
			);
			return data;
		},
		enabled: !!organisationId && !!stockAdjustmentId,
	});
};
