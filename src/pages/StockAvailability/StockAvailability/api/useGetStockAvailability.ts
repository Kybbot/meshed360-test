import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetStockAvailabilityResponseType } from "@/@types/stockAvailability";

export const useGetStockAvailability = ({
	organisationId,
	searchValue,
	pageNumber,
	pageSize,
	productSort,
	locationSort,
	batchSort,
}: {
	organisationId?: string;
	searchValue: string;
	pageNumber: string;
	pageSize: string;
	productSort?: "asc" | "desc";
	locationSort?: "asc" | "desc";
	batchSort?: "asc" | "desc";
}) => {
	return useQuery<ApiResult<GetStockAvailabilityResponseType>, AxiosError<ApiError>>({
		queryKey: [
			"get-stock-availability",
			organisationId,
			{ searchValue, pageSize, pageNumber, productSort, locationSort, batchSort },
		],
		queryFn: async () => {
			const params = new URLSearchParams({
				search: searchValue,
				pageSize,
				pageNumber,
			});
			if (productSort) params.append("productNameSort", productSort);
			if (locationSort) params.append("locationSort", locationSort);
			if (batchSort) params.append("batchSort", batchSort);

			const { data } = await axiosInstance.get<ApiResult<GetStockAvailabilityResponseType>>(
				`/api/stock-availability-details/${organisationId}?${params.toString()}`,
			);

			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
