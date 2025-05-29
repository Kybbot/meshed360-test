import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetCustomersByIdResponseType } from "@/@types/customers";

export const useGetCustomerById = ({
	customerId,
	organisationId,
}: {
	customerId?: string;
	organisationId?: string;
}) => {
	return useQuery<ApiResult<GetCustomersByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-customer-by-id", customerId, organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetCustomersByIdResponseType>>(
				`/api/customers/${customerId}?organisationId=${organisationId}`,
			);
			return data;
		},
		enabled: !!customerId && !!organisationId,
	});
};
