import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetRestockByIdResponseType } from "@/@types/salesOrders/api.ts";

export const useGetOrderRestock = ({
	organisationId,
	orderId,
}: {
	organisationId?: string;
	orderId?: string;
}) => {
	return useQuery<ApiResult<GetRestockByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-restock-by-id", organisationId, orderId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetRestockByIdResponseType>>(
				`/api/sales-orders/${organisationId}/orders/${orderId}/restock`,
			);
			return data;
		},
		enabled: !!organisationId && !!orderId,
	});
};
