import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllUsersResponseType } from "@/@types/users";

export const useGetAllUsers = ({
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
	return useQuery<ApiResult<GetAllUsersResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-all-users", organisationId, { searchValue, pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllUsersResponseType>>(
				`/api/user/${organisationId}?search=${searchValue}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
