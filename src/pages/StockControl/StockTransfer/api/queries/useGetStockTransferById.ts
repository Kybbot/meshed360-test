import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { ApiError, ApiResult } from "@/@types/api";
import { GetStockTransferResponseType } from "@/@types/stockControl";

export const useGetStockTransferById = ({
	organisationId,
	stockTransferId,
}: {
	organisationId?: string;
	stockTransferId?: string;
}) => {
	return useQuery<ApiResult<GetStockTransferResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-stock-transfer-by-id", organisationId, stockTransferId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetStockTransferResponseType>>(
				`/api/stock-control/${organisationId}/transfers/${stockTransferId}`,
			);
			return data;
		},
		enabled: !!organisationId && !!stockTransferId,
	});
};
