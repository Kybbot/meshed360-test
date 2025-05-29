import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { NormalizedAddressesData, GetAllCustomerAddressesResponseType } from "@/@types/customers";

export const useGetAllCustomerAddresses = ({
	customerId,
	pageNumber,
	pageSize,
}: {
	customerId?: string;
	pageNumber: string;
	pageSize: string;
}) => {
	return useQuery<ApiResult<NormalizedAddressesData>, AxiosError<ApiError>>({
		queryKey: ["get-all-customer-addresses", customerId, { pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllCustomerAddressesResponseType>>(
				`/api/customers/addresses/${customerId}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return {
				data: {
					totalCount: data.data.totalCount,
					totalPages: data.data.totalPages,
					addresses: data.data.addresses,
				},
				status: data.status,
			};
		},
		enabled: !!customerId,
		placeholderData: keepPreviousData,
	});
};
