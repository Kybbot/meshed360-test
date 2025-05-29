import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CategoryType, CreateCategoryBody } from "@/@types/categories";

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<CategoryType>,
		AxiosError<ApiError>,
		{
			categoryId: string;
			body: CreateCategoryBody;
		}
	>({
		mutationFn: async ({ categoryId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<CategoryType>>(
				`/api/organisation/category/${categoryId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-categories"],
			});
			toast.success("Category was successfully updated");
		},
	});
};
