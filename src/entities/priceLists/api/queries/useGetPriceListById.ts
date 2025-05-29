import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetPriceListByIdResponseType } from "@/@types/priceLists";

export const useGetPriceListById = ({ priceListId }: { priceListId?: string }) => {
	return useQuery<ApiResult<GetPriceListByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-priceList-by-id", priceListId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetPriceListByIdResponseType>>(
				`/api/organisation/price-list/by-id/${priceListId}`,
			);

			return data;
		},
		enabled: !!priceListId,
	});
};
