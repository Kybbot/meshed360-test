import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllWarehousesResponseType } from "@/@types/warehouses";

export const useGetAllWarehouses = ({
	organisationId,
	searchValue,
	pageNumber,
	pageSize,
}: {
	organisationId?: string;
	searchValue: string;
	pageNumber: string;
	pageSize: string;
}) => {
	return useQuery<ApiResult<GetAllWarehousesResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-all-warehouses", organisationId, { searchValue, pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllWarehousesResponseType>>(
				`/api/warehouses/${organisationId}?search=${searchValue}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
