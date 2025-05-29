import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllCurrenciesNameResponseType } from "@/@types/currencies";

export const useGetCurrenciesName = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetAllCurrenciesNameResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-currencies-name", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllCurrenciesNameResponseType>>(
				`/api/organisation/currency-name/${organisationId}`,
			);

			return data;
		},
		enabled: !!organisationId,
	});
};
