import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllCustomersResponseType } from "@/@types/customers";

export const useGetCustomers = ({
	organisationId,
	searchValue,
}: {
	organisationId?: string;
	searchValue: string;
}) => {
	return useQuery<ApiResult<GetAllCustomersResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-customers", organisationId, searchValue],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllCustomersResponseType>>(
				`/api/customers/by-org/${organisationId}?isActive=true&search=${searchValue}`,
			);

			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
