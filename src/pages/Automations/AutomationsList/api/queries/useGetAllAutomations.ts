import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllAutomationsResponseType } from "@/@types/automations";

export const useGetAllAutomations = ({
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
	return useQuery<ApiResult<GetAllAutomationsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-all-automations", organisationId, { searchValue, pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllAutomationsResponseType>>(
				`/api/automations/${organisationId}?search=${searchValue}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
