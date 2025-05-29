import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllAssemblyResultResponseType } from "@/@types/assembly/result";

export const useGetAssemblyResult = ({ assemblyId }: { assemblyId?: string }) => {
	return useQuery<ApiResult<GetAllAssemblyResultResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-assembly-result", assemblyId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllAssemblyResultResponseType>>(
				`/api/assemblies/result/${assemblyId}`,
			);
			return data;
		},
		enabled: !!assemblyId,
	});
};
