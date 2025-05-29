import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { axiosInstance } from "@/utils/axios";
import { ApiError, ApiResult } from "@/@types/api";

import { ProductNamesResponseType } from "@/@types/stockControl";

export const useGetProductNames = ({
	organisationId,
	locationId,
	categoryId,
	brandId,
}: {
	organisationId?: string;
	locationId: string;
	categoryId?: string;
	brandId?: string;
}) => {
	return useQuery<ApiResult<ProductNamesResponseType[]>, AxiosError<ApiError>>({
		queryKey: ["product-names-availability", organisationId, locationId, categoryId, brandId],
		queryFn: async () => {
			const queryParams = new URLSearchParams({
				locationId,
			});

			if (categoryId) queryParams.append("categoryId", categoryId);
			if (brandId) queryParams.append("brandId", brandId);

			const { data } = await axiosInstance.get<ApiResult<ProductNamesResponseType[]>>(
				`/api/organisation/product-names/${organisationId}?${queryParams.toString()}`,
			);

			return data;
		},
		enabled: !!organisationId && !!locationId,
	});
};
