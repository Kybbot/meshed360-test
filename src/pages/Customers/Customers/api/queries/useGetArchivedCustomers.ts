import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllCustomersResponseType } from "@/@types/customers";

export const useGetArchivedCustomers = ({
	organisationId,
	searchValue,
	currentTab,
	pageNumber,
	pageSize,
	sort,
}: {
	organisationId?: string;
	searchValue: string;
	currentTab: boolean;
	pageNumber: string;
	pageSize: string;
	sort?: "asc" | "desc";
}) => {
	return useQuery<ApiResult<GetAllCustomersResponseType>, AxiosError<ApiError>>({
		queryKey: [
			"get-archived-customers",
			organisationId,
			{ searchValue, pageSize, pageNumber, isActive: false, sort },
		],
		queryFn: async () => {
			const params = new URLSearchParams({
				isActive: "false",
				search: searchValue,
				pageSize,
				pageNumber,
			});

			if (sort) params.append("orderByName", sort);

			const { data } = await axiosInstance.get<ApiResult<GetAllCustomersResponseType>>(
				`/api/customers/by-org/${organisationId}?${params.toString()}`,
			);

			return data;
		},
		enabled: !!organisationId && currentTab,
		placeholderData: keepPreviousData,
	});
};
