import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CategoryType } from "@/@types/categories";

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<CategoryType>,
		AxiosError<ApiError>,
		{ categoryId: string; organisationId: string }
	>({
		mutationFn: async ({ categoryId, organisationId }) => {
			const { data } = await axiosInstance.delete<ApiResult<CategoryType>>(
				`api/organisation/category/${categoryId}/${organisationId}`,
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-categories"],
			});
			toast.success("Category was successfully deleted");
		},
	});
};
