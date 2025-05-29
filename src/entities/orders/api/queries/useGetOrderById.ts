import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetOrderByIdResponseType } from "@/@types/salesOrders/api.ts";

export const useGetOrderById = ({
	organisationId,
	orderId,
}: {
	organisationId?: string;
	orderId?: string;
}) => {
	return useQuery<ApiResult<GetOrderByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-order-by-id", organisationId, orderId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetOrderByIdResponseType>>(
				`/api/sales-orders/${organisationId}/orders/by-id/${orderId}`,
			);
			return data;
		},
		enabled: !!organisationId && !!orderId,
	});
};
