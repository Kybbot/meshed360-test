import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllCustomerContactsResponseType } from "@/@types/customers";

export const useGetAllCustomerContacts = ({
	customerId,
	pageNumber,
	pageSize,
}: {
	customerId?: string;
	pageNumber: string;
	pageSize: string;
}) => {
	return useQuery<ApiResult<GetAllCustomerContactsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-all-customer-contacts", customerId, { pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllCustomerContactsResponseType>>(
				`/api/customers/contacts/${customerId}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return data;
		},
		enabled: !!customerId,
		placeholderData: keepPreviousData,
	});
};
