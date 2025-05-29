import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllProductsResponseType } from "@/@types/products";

export const useGetProducts = ({
	organisationId,
	searchValue,
	type,
	template,
}: {
	type: "stock" | "service";
	template?: "WOOL";
	organisationId?: string;
	searchValue?: string;
}) => {
	return useQuery<ApiResult<GetAllProductsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-select-products", organisationId, searchValue, { isActive: true, type, template }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllProductsResponseType>>(
				`/api/organisation/products/${organisationId}?isActive=true&search=${searchValue ? searchValue : ""}&type=${type.toUpperCase()}${template ? `&template=${template}` : ""}`,
			);

			return data;
		},
		staleTime: 5 * 60 * 1000,
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
