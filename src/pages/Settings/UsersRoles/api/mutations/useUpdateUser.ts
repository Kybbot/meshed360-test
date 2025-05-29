import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { UpdateUserBody, UserType } from "@/@types/users";

export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UserType>,
		AxiosError<ApiError>,
		{
			userId: string;
			body: UpdateUserBody;
		}
	>({
		mutationFn: async ({ userId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<UserType>>(
				`/api/user/${userId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-users"],
			});
			toast.success("User was successfully updated");
		},
	});
};
