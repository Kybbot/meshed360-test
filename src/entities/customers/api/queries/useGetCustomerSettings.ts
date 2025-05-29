import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetCustomerSettingsResponseType } from "@/@types/customers";

export const useGetCustomerSettings = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetCustomerSettingsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-customer-settings", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetCustomerSettingsResponseType>>(
				`/api/customers/settings/${organisationId}`,
			);
			return data;
		},
		enabled: !!organisationId,
	});
};
