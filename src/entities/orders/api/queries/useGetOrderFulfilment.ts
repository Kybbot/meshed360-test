import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetFulfilmentByIdResponseType } from "@/@types/salesOrders/api.ts";

export const useGetOrderFulfilment = ({
	organisationId,
	orderId,
	disabled,
}: {
	organisationId?: string;
	orderId?: string;
	disabled?: boolean;
}) => {
	return useQuery<ApiResult<GetFulfilmentByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-fulfilment-by-id", organisationId, orderId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetFulfilmentByIdResponseType>>(
				`/api/sales-orders/${organisationId}/orders/${orderId}/fulfillments`,
			);
			return data;
		},
		enabled: !!organisationId && !!orderId && !disabled,
	});
};
