import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetOrderSettingsResponseType } from "@/@types/salesOrders/api.ts";

export const useGetOrderSettings = ({
	organisationId,
	customerId,
}: {
	organisationId?: string;
	customerId?: string;
}) => {
	return useQuery<ApiResult<GetOrderSettingsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-order-settings", organisationId, customerId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetOrderSettingsResponseType>>(
				`/api/orders/sales/details/${organisationId}/${customerId}`,
			);
			return data;
		},
		enabled: !!organisationId && !!customerId,
	});
};
