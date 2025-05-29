import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ApiError, ApiResult } from "@/@types/api";

import { axiosInstance } from "@/utils/axios";

type Result = {
	accessToken: string;
	refreshToken: string;
};

export const useLogin = () => {
	return useMutation<
		ApiResult<Result>,
		AxiosError<ApiError>,
		{
			body: {
				email: string;
				password: string;
			};
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<Result>>(`/api/user/auth`, JSON.stringify(body));

			return data;
		},
	});
};
