import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetProductByIdResponseType } from "@/@types/products";

export const useGetProductById = ({
	productId,
	organisationId,
}: {
	productId?: string;
	organisationId?: string;
}) => {
	return useQuery<ApiResult<GetProductByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-product-by-id", productId, organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetProductByIdResponseType>>(
				`/api/organisation/product-details/${productId}?organisationId=${organisationId}`,
			);
			return data;
		},
		enabled: !!productId && !!organisationId,
	});
};
