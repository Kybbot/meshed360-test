import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { UserType } from "@/@types/users";
import { ApiError, ApiResult } from "@/@types/api";

export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation<ApiResult<UserType>, AxiosError<ApiError>, { userId: string }>({
		mutationFn: async ({ userId }) => {
			const { data } = await axiosInstance.delete<ApiResult<UserType>>(`api/user/${userId}`);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-users"],
			});
			toast.success("User was successfully deleted");
		},
	});
};
