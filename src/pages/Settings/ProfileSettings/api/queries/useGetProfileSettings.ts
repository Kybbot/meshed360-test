import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetProfileSettingsType } from "@/@types/profileSettings";

export const useGetProfileSettings = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetProfileSettingsType>, AxiosError<ApiError>>({
		queryKey: ["get-profile-settings", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetProfileSettingsType>>(
				`/api/organisation/profile/${organisationId}`,
			);

			return data;
		},
		enabled: !!organisationId,
	});
};
