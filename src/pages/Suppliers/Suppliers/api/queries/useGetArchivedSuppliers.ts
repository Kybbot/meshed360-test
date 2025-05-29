import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllSuppliersResponseType } from "@/@types/suppliers";

export const useGetArchivedSuppliers = ({
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
	return useQuery<ApiResult<GetAllSuppliersResponseType>, AxiosError<ApiError>>({
		queryKey: [
			"get-archived-suppliers",
			organisationId,
			{ searchValue, pageSize, pageNumber, isActive: false, sort },
		],
		queryFn: async () => {
			const query = new URLSearchParams({
				isActive: "false",
				search: searchValue,
				pageSize,
				pageNumber,
			});

			if (sort) {
				query.append("orderByName", sort);
			}

			const { data } = await axiosInstance.get<ApiResult<GetAllSuppliersResponseType>>(
				`/api/suppliers/organisation/${organisationId}?${query.toString()}`,
			);

			return data;
		},
		enabled: !!organisationId && currentTab,
		placeholderData: keepPreviousData,
	});
};
