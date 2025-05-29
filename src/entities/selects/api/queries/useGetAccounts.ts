import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllAccountsResponseType } from "@/@types/selects";

export const useGetAccounts = ({
	type,
	searchValue,
	organisationId,
}: {
	searchValue: string;
	organisationId?: string;
	type: "expenseAccounts" | "salesRevenueAccount";
}) => {
	return useQuery<ApiResult<GetAllAccountsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-select-accounts", organisationId, searchValue, { type }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllAccountsResponseType>>(
				`/api/organisation/xero-accounts/${organisationId}?search=${searchValue}&type=${type}`,
			);

			return data;
		},
		staleTime: 5 * 60 * 1000,
		enabled: !!organisationId,
	});
};
