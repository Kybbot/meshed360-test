import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllSuppliersResponseType } from "@/@types/suppliers";

export const useGetSuppliers = ({
	organisationId,
	searchValue,
}: {
	organisationId?: string;
	searchValue: string;
}) => {
	return useQuery<ApiResult<GetAllSuppliersResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-suppliers", organisationId, searchValue],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllSuppliersResponseType>>(
				`/api/suppliers/organisation/${organisationId}?isActive=true&search=${searchValue}`,
			);

			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
