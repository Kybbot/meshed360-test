import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllTaxRatesResponseType } from "@/@types/selects";

export const useGetTaxRates = ({
	organisationId,
	searchValue,
	type,
}: {
	type?: "sales" | "purchase";
	organisationId?: string;
	searchValue: string;
}) => {
	return useQuery<ApiResult<GetAllTaxRatesResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-select-tax-rates", organisationId, { searchValue, type }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllTaxRatesResponseType>>(
				`/api/organisation/tax-rates/${organisationId}?search=${searchValue}&type=${type}`,
			);

			return data;
		},
		staleTime: 5 * 60 * 1000,
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
