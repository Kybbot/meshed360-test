import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CategoryType, CreateCategoryBody } from "@/@types/categories";

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<CategoryType>,
		AxiosError<ApiError>,
		{
			body: CreateCategoryBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<CategoryType>>(
				`/api/organisation/category`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-categories"],
			});
			toast.success("New Category was successfully added");
		},
	});
};
