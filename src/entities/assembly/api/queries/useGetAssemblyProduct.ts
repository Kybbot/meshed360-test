import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAssemblyProductResponseType } from "@/@types/assembly/assembly";

export const useGetAssemblyProduct = ({ productId }: { productId?: string }) => {
	return useQuery<ApiResult<GetAssemblyProductResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-assembly-product", productId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAssemblyProductResponseType>>(
				`/api/assemblies/details?productId=${productId}`,
			);

			return data;
		},
		enabled: !!productId,
	});
};
