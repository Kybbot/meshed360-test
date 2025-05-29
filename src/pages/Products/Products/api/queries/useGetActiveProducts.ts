import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllProductsResponseType } from "@/@types/products";

export const useGetActiveProducts = ({
	organisationId,
	searchValue,
	currentTab,
	pageNumber,
	pageSize,
}: {
	organisationId?: string;
	searchValue: string;
	currentTab: boolean;
	pageNumber: string;
	pageSize: string;
}) => {
	return useQuery<ApiResult<GetAllProductsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-active-products", organisationId, { searchValue, pageSize, pageNumber, isActive: true }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllProductsResponseType>>(
				`/api/organisation/products/${organisationId}?isActive=true&search=${searchValue}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return data;
		},
		enabled: !!organisationId && currentTab,
		placeholderData: keepPreviousData,
	});
};
