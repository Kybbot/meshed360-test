import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetConfigurationSettingsResponseType } from "@/@types/configurationSettings";

export const useGetConfigurationSettings = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetConfigurationSettingsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-configuration-settings", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetConfigurationSettingsResponseType>>(
				`/api/organisation/xero-settings/${organisationId}`,
			);

			return data;
		},
		enabled: !!organisationId,
	});
};
