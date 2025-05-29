import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetOrganisationXeroAccountsAllTypesResponse } from "@/@types/defaultAccountMapping";

export const useGetOrganisationXeroAccountsAllTypes = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetOrganisationXeroAccountsAllTypesResponse>, AxiosError<ApiError>>({
		queryKey: ["get-organisation-xero-accounts-all-types", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetOrganisationXeroAccountsAllTypesResponse>>(
				`/api/organisation/xero-accounts-types/${organisationId}`,
			);

			return data;
		},
		enabled: !!organisationId,
	});
};
