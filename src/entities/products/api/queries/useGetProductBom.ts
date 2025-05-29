import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetProductBOMResponseType } from "@/@types/products";

export const useGetProductBOM = ({ productId }: { productId?: string }) => {
	return useQuery<ApiResult<GetProductBOMResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-product-bom", productId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetProductBOMResponseType>>(
				`/api/organisation/products/${productId}/bom`,
			);
			return data;
		},
		enabled: !!productId,
	});
};
