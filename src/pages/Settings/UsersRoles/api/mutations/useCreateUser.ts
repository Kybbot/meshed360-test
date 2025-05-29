import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateUserBody, UserType } from "@/@types/users";

export const useCreateUser = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UserType>,
		AxiosError<ApiError>,
		{
			body: CreateUserBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<UserType>>(`/api/user`, JSON.stringify(body));

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-users"],
			});
			toast.success("New user was successfully added");
		},
	});
};
