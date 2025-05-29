import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetUserInfoResponseType } from "@/@types/user";

export const useGetUserInfo = () => {
	return useQuery<ApiResult<GetUserInfoResponseType>, AxiosError<ApiError>>({
		queryKey: ["user-info"],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetUserInfoResponseType>>(`/api/user/info`);

			return data;
		},
	});
};
