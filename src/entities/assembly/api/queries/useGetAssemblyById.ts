import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAssemblyByIdResponseType } from "@/@types/assembly/assembly";

export const useGetAssemblyById = ({
	assemblyId,
	organisationId,
}: {
	assemblyId?: string;
	organisationId?: string;
}) => {
	return useQuery<ApiResult<GetAssemblyByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-assembly-by-id", assemblyId, organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAssemblyByIdResponseType>>(
				`/api/assemblies/${assemblyId}?organisationId=${organisationId}`,
			);
			return data;
		},
		enabled: !!assemblyId && !!organisationId,
	});
};
