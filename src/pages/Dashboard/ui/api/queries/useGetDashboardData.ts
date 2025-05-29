import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetDashboardDataResponseType } from "@/@types/dashboard";

export const useGetDashboardData = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetDashboardDataResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-dashboard-data", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetDashboardDataResponseType>>(
				`/api/organisation/${organisationId}/dashboard`,
			);

			return data;
		},
		enabled: !!organisationId,
	});
};
