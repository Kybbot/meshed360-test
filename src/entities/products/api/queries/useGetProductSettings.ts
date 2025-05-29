import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetProductSettingsResponseType } from "@/@types/products";

export const useGetProductSettings = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetProductSettingsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-product-settings", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetProductSettingsResponseType>>(
				`/api/organisation/products-details/${organisationId}`,
			);
			return data;
		},
		enabled: !!organisationId,
	});
};
