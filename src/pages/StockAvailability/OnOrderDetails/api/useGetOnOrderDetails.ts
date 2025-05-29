import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetOnOrderDetailsResponseType } from "@/@types/stockAvailability";

export const useGetOnOrderDetails = ({
	organisationId,
	productId,
	warehouseId,
	searchValue,
	pageNumber,
	pageSize,
}: {
	organisationId?: string;
	productId?: string;
	warehouseId?: string;
	searchValue: string;
	pageNumber: string;
	pageSize: string;
}) => {
	return useQuery<ApiResult<GetOnOrderDetailsResponseType>, AxiosError<ApiError>>({
		queryKey: [
			"get-on-order-details",
			organisationId,
			productId,
			warehouseId,
			{ searchValue, pageSize, pageNumber },
		],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetOnOrderDetailsResponseType>>(
				`/api/on-order-details/${organisationId}?productId=${productId}&warehouseId=${warehouseId}&search=${searchValue}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);
			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
