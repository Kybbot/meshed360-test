import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetWarehousesAccountsResponse } from "@/@types/stockControl";

export const useGetWarehousesAccounts = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetWarehousesAccountsResponse>, AxiosError<ApiError>>({
		queryKey: ["warehouses-accounts", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetWarehousesAccountsResponse>>(
				`/api/organisation/warehouses-accounts/${organisationId}`,
			);
			return data;
		},
		enabled: !!organisationId,
	});
};
