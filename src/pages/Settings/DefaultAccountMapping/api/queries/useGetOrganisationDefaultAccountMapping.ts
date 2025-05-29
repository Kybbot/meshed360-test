import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { OrganisationDefaultAccountMappingResponse } from "@/@types/defaultAccountMapping";

export const useGetOrganisationDefaultAccountMapping = ({ organisationId }: { organisationId: string }) => {
	return useQuery<ApiResult<OrganisationDefaultAccountMappingResponse>, AxiosError<ApiError>>({
		queryKey: ["get-organisation-default-account-mappings", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<OrganisationDefaultAccountMappingResponse>>(
				`/api/organisation/default-account-mappings/${organisationId}`,
			);

			return data;
		},
		enabled: !!organisationId,
	});
};
