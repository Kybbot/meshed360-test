import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetOrganisationConnectionStatusResponseType } from "@/@types/organisations";

export const useGetOrganisationConnectionStatus = ({
	organisationId,
	isError,
}: {
	organisationId?: string;
	isError: boolean;
}) => {
	return useQuery<ApiResult<GetOrganisationConnectionStatusResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-organisation-connection-status", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetOrganisationConnectionStatusResponseType>>(
				`/api/organisations/connection-status/${organisationId}`,
			);
			return data;
		},
		enabled: !!organisationId && !isError,
	});
};
