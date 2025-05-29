import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllWarehousesResponseType } from "@/@types/warehouses";

export const useGetWarehoueses = ({
	organisationId,
	searchValue,
}: {
	organisationId?: string;
	searchValue: string;
}) => {
	return useQuery<ApiResult<GetAllWarehousesResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-select-warehouses", organisationId, searchValue],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllWarehousesResponseType>>(
				`/api/warehouses/${organisationId}?search=${searchValue}`,
			);

			return data;
		},
		staleTime: 5 * 60 * 1000,
		enabled: !!organisationId,
	});
};
