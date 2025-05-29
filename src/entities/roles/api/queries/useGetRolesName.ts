import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllRolesResponseType } from "@/@types/roles";

export const useGetRolesName = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetAllRolesResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-roles-name", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllRolesResponseType>>(
				`/api/role-name/${organisationId}`,
			);

			return data;
		},
		enabled: !!organisationId,
	});
};
