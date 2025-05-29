import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetSalesDefaultsResponseType } from "@/@types/salesDefaults";

export const useGetSalesDefaults = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetSalesDefaultsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-sales-defaults", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetSalesDefaultsResponseType>>(
				`/api/organisation/settings/${organisationId}`,
			);

			return data;
		},
		enabled: !!organisationId,
	});
};
