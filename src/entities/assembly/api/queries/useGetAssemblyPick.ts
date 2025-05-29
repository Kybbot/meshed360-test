import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAssemblyPickResponseType } from "@/@types/assembly/pick";

export const useGetAssemblyPick = ({ assemblyId }: { assemblyId?: string }) => {
	return useQuery<ApiResult<GetAssemblyPickResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-assembly-pick", assemblyId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAssemblyPickResponseType>>(
				`/api/assemblies/pick/${assemblyId}`,
			);
			return data;
		},
		enabled: !!assemblyId,
	});
};
